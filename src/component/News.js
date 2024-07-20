import NewsItems from "./NewsItems";
import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News = ({ country = 'in', pageSize = 8, category = 'general', setProgress }) => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitaliseString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=c794dfa4015a48a89118d8bb7824b6d5&page=${page}&pageSize=${pageSize}`;
    let data = await fetch(url);
    setProgress(30);
    let parsedData = await data.json();
    setProgress(70);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setProgress(100);
  };

  useEffect(() => {
    document.title = `${capitaliseString(category)} - NewsNova`;
    updateNews();
    // eslint-disable-next-line
  }, []);

  const fetchMoreData = async () => {
    setPage(page + 1);
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=c794dfa4015a48a89118d8bb7824b6d5&page=${page + 1}&pageSize=${pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
  };

  return (
    <>
      <h1 className="text-center" style={{ margin: "40px 0px", marginTop: "90px" }}>NewsNova - Top {capitaliseString(category)} Headlines</h1>
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<h4>Loading...</h4>}
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItems source={element.source.name} author={element.author} date={element.publishedAt} title={element.title ? element.title : ""} description={element.description ? element.description : ""} imgurl={element.urlToImage} url={element.url} />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  setProgress: PropTypes.func.isRequired
};

export default News;
