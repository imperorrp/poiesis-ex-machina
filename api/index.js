import Together from "together-ai";
import mongoose from 'mongoose';

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

const MONGODB_URI = process.env.MONGODB_URI; // needed for establishing MongoDB Atlas connection
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

/*
  Logic/Flow:
  1. Connect to Together and MongoDB
  2. Extract the query parameters from the request URL
  3. Generate a poem 
  4. Generate a concise text-to-image prompt from the poem 
  5. Generate image with prompt 
  6. Save the poem, prompt(optional) and image(optional) to MongoDB
  7. Return the poem and image URL as a JSON response
*/

// schema for storing the poem, prompt (optional), and image URL (optional)
const poemSchema = new mongoose.Schema({
  poem: { type: String, required: true },
  prompt: { type: String, required: false },
  imageUrl: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

// Add new schema for API call counting
const apiCallSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 }
});

async function connectToDB() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(MONGODB_URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error}`);
  }
}

// Helper function to generate a concise text-to-image prompt from the poem
async function getConcisePrompt(poem) {
  try {
    console.log("Generating a concise text-to-image prompt from the poem...");
    const response = await together.chat.completions.create({
      messages: [
          {
                  "role": "system",
                  "content": "You should only respond with a concise text-to-image prompt. No other fluff words, sentences, or summaries."
          },
          {
                  "role": "user",
                  "content": `Create a concise text-to-image prompt representing the imagery and vibes of this poem: ${poem}`
          }
    ],
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ["<|eot_id|>","<|eom_id|>"],
        stream: false,
    });

    const concisePrompt = response.choices[0].message.content;
    
    console.log("Concise text-to-image prompt:", concisePrompt);
    return concisePrompt;
  } catch (error) {
    console.error("Error generating concise prompt:", error);
    return null;
  }
}

// Helper function to fetch image URL
async function getImageUrl(textToImagePrompt) {
  try {
    console.log("Generating image for the prompt...");
    const input = {
      prompt: textToImagePrompt
    };

    const response = await together.images.create({
        model: "black-forest-labs/FLUX.1-schnell-Free", // previously: stabilityai/stable-diffusion-xl-base-1.0
        prompt: input.prompt,
        width: 1024,
        height: 1024,
        steps: 4,
        n: 1,
        //seed: 8528,
        response_format: "b64_json"});
    //console.log(response.data[0].b64_json);
    const b64_json = response.data[0].b64_json;
    const imageUrl = `data:image/png;base64,${b64_json}`;
    //console.log("Extracted Image URL:", imageUrl);

    return imageUrl;
  } catch (error) {
    console.error("Error fetching image URL:", error);
    return null;
  }
}

// Add function to check and update API call count (hard coded to 500 calls per day currently)
async function checkRateLimit() {
  const ApiCall = mongoose.model('ApiCall', apiCallSchema);
  const today = new Date().toISOString().split('T')[0];
  
  const dailyCount = await ApiCall.findOne({ date: today });
  
  if (!dailyCount) {
    await ApiCall.create({ date: today, count: 1 });
    return true;
  }
  
  if (dailyCount.count >= 500) {
    return false;
  }
  
  await ApiCall.updateOne(
    { date: today },
    { $inc: { count: 1 } }
  );

  console.log('Total API calls today:', dailyCount.count + 1);
  return true;
}

export async function GET(request) {
  try {
    await connectToDB();
    
    // Check rate limit before processing
    const withinLimit = await checkRateLimit();
    if (!withinLimit) {
      await mongoose.disconnect();
      return new Response(JSON.stringify({ 
        error: "Rate limit exceeded. Maximum 500 calls per day." 
      }), {
        status: 429,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    //console.log(`GET request received: ${request.url}`);
    // Extract the query parameter 'vibe' from the request URL
    const urlParams = new URLSearchParams(request.url.slice(request.url.indexOf("?") + 1));
    console.log('urlParams:', urlParams);
    let archetype = urlParams.get('archetype') || '';
    let prompt = urlParams.get('prompt') || '';
    let image = urlParams.get('image') || 'false'; 
    console.log(`GET request received. urlParams = ${urlParams}\n\n Params=\n  Archetype: ${archetype}\n  Prompt: ${prompt}\n  Image: ${image}`);

    console.log(`Generating... | Archetype = ${archetype} | Prompt = ${prompt}`)
    // Generate poem using Together AI 
    const response = await together.chat.completions.create({
        messages: [
            {
                    "role": "system",
                    "content": "You should only respond with poems. No other fluff words, sentences, or summaries."
            },
            {
                    "role": "user",
                    "content": `Embody the collective unconscious archetype of the ${archetype}. Write a brief, unique, creative poem on the topic- \"${prompt}\".\n`
            }
    ],
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ["<|eot_id|>","<|eom_id|>"],
        stream: false,
    });

    //console.log(response.choices[0].message.content);
    const poem = response.choices[0].message.content;
    console.log(`Poem generated by user: ${poem}`);

    let imageUrl = false;
    let textToImagePrompt = false;
    if (image=='true'){
      textToImagePrompt = await getConcisePrompt(poem);
      imageUrl = await getImageUrl(textToImagePrompt);
      const trimmedImageUrl = imageUrl.substring(0, 50);
      console.log("Trimmed Image URL:", trimmedImageUrl);
    } else {
      imageUrl = false;
    }

    // Save to MongoDB
    const Poem = mongoose.model('Poem', poemSchema);
    const newPoemData = { poem };
    if (textToImagePrompt) {
      newPoemData.prompt = textToImagePrompt;
    }
    if (imageUrl) {
      newPoemData.imageUrl = imageUrl;
    }
    const newPoem = new Poem(newPoemData);
    await newPoem.save();
    console.log('Poem saved to database');


    // Return the poem as a JSON response
    return new Response(JSON.stringify({ poem, imageUrl }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    await mongoose.disconnect();
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}


