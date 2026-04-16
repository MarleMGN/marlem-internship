import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import Skeleton from "../UI/Skeleton";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections";

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    mobileFirst: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get(API_URL);

        setTimeout(() => {
          setCollections(res.data);
          setLoading(false);
        }, 1500);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    if (!loading && collections.length > 0 && sliderRef.current) {
      const id = requestAnimationFrame(() => {
        sliderRef.current.innerSlider?.onWindowResized?.() 
      });
      return () => cancelAnimationFrame(id);
    }
  }, [loading, collections.length]);

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
          <div className="text-center">
            <h2>Hot Collections</h2>
            <div className="small-border bg-color-2"></div>
          </div>
          <div>
            {loading ? (
              new Array(4).fill(0).map((_, index) => (
                <div style={{ padding: "0 10px" }} key={index}>
                  <Skeleton width="100%" height="300px" borderRadius="10px" />
                </div>
              ))
            ) : (
              <Slider ref={sliderRef} {...settings}>
                {collections.map((collection) => (
                  <div style={{ padding: "0 10px" }} key={collection.id}>
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Link to="/item-details">
                          <img
                            src={collection.nftImage}
                            className="lazy img-fluid"
                            alt=""
                          />
                        </Link>
                      </div>

                      <div className="nft_coll_pp">
                        <Link to="/author">
                          <img
                            className="lazy pp-coll"
                            src={collection.authorImage}
                            alt=""
                          />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>

                      <div className="nft_coll_info">
                        <Link to="/explore">
                          <h4>{collection.title}</h4>
                        </Link>
                        <span>{collection.code}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>
      </div>
    </section>
  );
};

export default HotCollections;
