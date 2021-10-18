import React from 'react'
import defaultimg from '../shared/img/news.jpg'
import Styles from './dashboard.module.css'

export default function News({articles}) {
    if(articles.urlToImage===null)
    {
        articles.urlToImage=defaultimg;
    }
    const tar="_blank";
    return ( 
        <div>
            <div className="card mb-3 shadow-sm p-3 mb-5 bg-body rounded">
                <div className="row g-0">
                    <div className="col-md-2">
                        <img src={articles.urlToImage} id={Styles.newsimg} className="rounded img-fluid" alt=""/>
                    </div>
                    <div className="col">
                        <div className="card-body" id={Styles.newstext}>
                            <h5 className="card-title">{articles.title}</h5>
                            <p className="card-text">{articles.description}</p>
                            <p className="card-text"><small className="text-muted">Source : {articles.source.name}</small></p>
                            <a href={articles.url} target={tar} className="card-link">Read more</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
