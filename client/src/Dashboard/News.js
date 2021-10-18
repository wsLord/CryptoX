import React from 'react'
import defaultimg from '../shared/img/news.jpg'
import Styles from './dashboard.module.css'

export default function News({articles}) {
    if(articles.urlToImage===null)
    {
        articles.urlToImage=defaultimg;
        console.log(articles.urlToImage)
    }
    const tar="_blank";
    return ( 
        <div>
            <div class="card mb-3 shadow-sm p-3 mb-5 bg-body rounded">
                <div class="row g-0">
                    <div class="col-md-2">
                        <img src={articles.urlToImage} id={Styles.newsimg} class="rounded img-fluid" alt=""/>
                    </div>
                    <div class="col">
                        <div class="card-body" id={Styles.newstext}>
                            <h5 class="card-title">{articles.title}</h5>
                            <p class="card-text">{articles.description}</p>
                            <p class="card-text"><small class="text-muted">Source : {articles.source.name}</small></p>
                            <a href={articles.url} target={tar} class="card-link">Read more</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
