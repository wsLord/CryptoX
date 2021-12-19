import React from 'react'
import Styles from './Transaction.module.css'
import success from '../shared/img/success.png'
import failed from '../shared/img/failed.png'

export default function BuySellDetails(props) {
    return (
        <div>
            <div class="card m-5 shadow p-3 mb-5 bg-body rounded">
                <div class="card-body">
                    {props.status &&
                        <div>
                            <img src={success} alt="" id={Styles.simg}/>
                            <div class="card" id={Styles.details}>
                                <div class="card-body">
                                    This is some text within a card body.
                                </div>
                            </div>
                        </div>
                    }
                    {!props.status &&
                        <div>
                            <img src={failed} alt="" id={Styles.simg}/>
                            <div class="card" id={Styles.details}>
                                <div class="card-body">
                                    This is some text within a card body.
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
