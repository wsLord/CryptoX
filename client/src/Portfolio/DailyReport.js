import React from 'react'
import Pdf from "react-to-pdf";

export default function DailyReport() {
    const data = "this is daily report!!!!!!!!!"
    const ref = React.createRef();
    return (
        <div>
            <div ref={ref}>{data}</div>
            <Pdf targetRef={ref} filename="daily_report.pdf">
                {({ toPdf }) => <button onClick={toPdf} className='btn btn-success mt-3'><i class="fa fa-file-pdf-o fs-5"></i> Generate pdf</button>}
            </Pdf>
        </div>
    )
}
