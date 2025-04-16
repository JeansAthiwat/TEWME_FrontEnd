import React from "react"
import { CirclePlus } from "lucide-react"
export default function ArrayField({header, array, addFunction}){
    return <>
        <p>{header}</p>
        <div className='flex flex-row wrap items-center gap-2'>
          {array.length>0 && array.map((e, idx) => <p key={idx} className='p-2 border-1 border-gray-300 rounded-lg '>{e}</p>)
          }
          {array.length<5 && <CirclePlus onClick={addFunction} className='text-gray-600'/>}</div>
          </>
}