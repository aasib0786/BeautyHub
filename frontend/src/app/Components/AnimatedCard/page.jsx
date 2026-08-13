"use client";
import React, { use, useEffect, useState } from "react";
import styles from "./animatedProduct.css";
import Image from "next/image";
import { RiHeartAddFill } from "react-icons/ri";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedProducts } from "@/app/redux/slice/productSlice";
import {
  addToWishlist,
  addToWishlistToLocal,
  loadWishlistFromLocalStorage,
  removeFromWishlistToLocal,
  removeFromWishlistToServer,
} from "@/app/redux/slice/wislistSlice";
import { generateSlug } from "@/app/utils/generate-slug";

export default function Products() {
  const [isLiked, setIsLiked] = useState(false);
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);

  const handleWishlist = async (productId, product) => {
    const exist = wishlist?.products?.some(
      (item) => item._id.trim() === productId.trim()
    );

    if (exist) {
      if (user && user?.email) {
        dispatch(removeFromWishlistToServer(productId));
      } else {
        dispatch(removeFromWishlistToLocal(productId));
      }
    } else {
      if (user && user?.email) {
        try {
          const response = await axiosInstance.post(
            "/api/v1/wishlist/add-to-wishlist",
            {
              productId,
            }
          );
          if (response.status === 201) {
            dispatch(addToWishlist(product));
          }
        } catch (error) {
          console.log("Error adding to wishlist:", error);
          toast.error("Failed to add to wishlist. Please try again.");
        }
      } else {
        dispatch(addToWishlistToLocal(product));
      }
    }
  };

  const productData = useSelector((state) => state.product.featuredProducts);
  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(loadWishlistFromLocalStorage());
  }, []);

  return (
    <>
      <div className="mt-3 mb-3">
        <div className={`container mt-4 ${styles.productContainer}`}>
          <div className="row row-cols-2   row-cols-sm-3 row-cols-md-5 g-4">
            {productData?.map((product, index) => (
              <div className="col" key={product._id ?? index}>
                <div
                  className={`card AniCardSec h-100 shadow-sm ${styles.productCard}`}
                >
                  {/* Image Carousel */}
                  <div
                    id={`carousel-${product._id}`}
                    className={`carousel slide ${styles.productCarousel}`}
                    data-bs-ride="carousel"
                    data-bs-interval="2000"
                    data-bs-pause="false"
                  >
                    <div
                      className={`carousel-inner ${styles.productCarouselInner}`}
                    >
                      <Link
                        href={`/Pages/products/${generateSlug(
                          product.productName,
                          product._id
                        )}`}
                        key={index}
                        className="product-link"
                      >
                        {product.images?.map((image, index) => (
                          <div
                            className={`carousel-item ${
                              index === 0 ? "active" : ""
                            }`}
                            key={index}
                          >
                            <Image
                              width={"100"}
                              height={"200"}
                              src={image}
                              className={`d-block  w-100 ${styles.productCarouselImage}`}
                              alt={product.productName}
                            />
                            <p className="discountSec">
                              {product?.discount}% Off
                            </p>
                          </div>
                        ))}
                      </Link>
                    </div>
                    {product.images.length > 1 && (
                      <>
                        <button
                          className={`carousel-control-prev ${styles.productCarouselControlPrev}`}
                          type="button"
                          data-bs-target={`#carousel-${product._id}`}
                          data-bs-slide="prev"
                        >
                          <span
                            className={`carousel-control-prev-icon ${styles.productCarouselControlPrevIcon}`}
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                          className={`carousel-control-next  ${styles.productCarouselControlNext}`}
                          type="button"
                          data-bs-target={`#carousel-${product._id}`}
                          data-bs-slide="next"
                        >
                          <span
                            className={`carousel-control-next-icon ${styles.productCarouselControlNextIcon}`}
                            aria-hidden="true"
                          ></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                      </>
                    )}
                  </div>

                  <div className="wishlistIconSec">
                    <RiHeartAddFill
                      className="fs-light"
                      style={{
                        color: wishlist?.products?.some(
                          (p) => p._id === product._id
                        )
                          ? "red"
                          : "white",
                      }}
                      onClick={() => handleWishlist(product._id, product)}
                    />
                  </div>
                  <div
                    className={`card-body product-card-body ${styles.productCardBody}`}
                  >
                    <h6
                      className={`card-title m-0  ${styles.productCardTitle}`}
                    >
                      {product?.productName}
                    </h6>
                  </div>
                  <div className="card-dropdown">
                    <div className="d-flex animatedDetails gap-3">
                      <Image
                        src={product?.images[product?.images.length - 1]}
                        alt="subimage"
                        height={40}
                        width={40}
                      />
                      {/* <b
                        className={`card-text text-muted ${styles.productCardDescription}`}
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                      ></b> */}
                    </div>
                    <div className="d-flex align-items-center m-0">
                      <p className={`card-text ${styles.productCardPrice} m-0`}>
                        {" "}
                        ₹ {product.finalPrice}
                      </p>
                      <p className="mb-0  text-success">
                        <del className="ms-2 text-center">
                          {" "}
                          &#8377;{product.price}
                        </del>
                      </p>
                    </div>
                    {/* <div className='d-flex'>
                      <p className='mt-2 text-success'> <del className='ms-2 text-center'> &#8377;{product.basePrice}</del></p>
                      <p className={`card-text ${styles.productCardPrice} m-0`}> ₹ {product.price}</p>
                    </div> */}

                    {/* <Link href={"/Pages/products/id"}> <button className={`btn btn-sm btn-outline-secondary w-100 ${styles.productViewDetailsButton}`}>View Details</button></Link> */}
                    <Link href={`/Pages/products/${product._id}`}>
                      {" "}
                      <button
                        className={`cardbtn text-light w-100 ${styles.productViewDetailsButton}`}
                      >
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
