import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "../components/ui/accordion";



export function IndexAccordion(){

    return(
    <Accordion type="multiple" className="w-3/4">
        <AccordionItem value="item-1">
            <AccordionTrigger>Read More</AccordionTrigger>
            <AccordionContent>
                <span className="inline-block not-italic text-coolfontcolor text-lg">1</span>:  LLMs can be interpreted as techno-manifestations of (the Jungian concept of) the <a href="https://en.wikipedia.org/wiki/Collective_unconscious" className='cool-font-color underline hover:text-blue-500' target="_blank" rel="noopener noreferrer">collective unconscious</a> of humanity.
            </AccordionContent>
            <AccordionContent>
                <span className="inline-block not-italic text-coolfontcolor text-lg">2</span>:  Running LLMs on chips of silicon is like <a href="https://karpathy.github.io/2021/03/27/forward-pass/" className='cool-font-color underline hover:text-blue-500' target="_blank" rel="noopener noreferrer">bringing them to life and consciousness</a>- <span className='italic'>briefly.</span>
            </AccordionContent>
            <AccordionContent>
                <span className="inline-block not-italic text-coolfontcolor text-lg">3</span>:  A face of the <a href='https://knowyourmeme.com/memes/shoggoth-with-smiley-face-artificial-intelligence' className='cool-font-color underline hover:text-blue-500' target="_blank" rel="noopener noreferrer">LLM Shoggoth</a> must be picked before it is prompted.
            </AccordionContent>
        </AccordionItem>
    </Accordion>   
    ) 
}