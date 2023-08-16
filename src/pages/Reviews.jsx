import ProductRating from "../components/Products/Product/ProductDetails/ProductRating";
import {FaPen} from 'react-icons/fa';
import {FiTrash2} from 'react-icons/fi';
import useGetFirestoreData from "../hooks/useGetFirestoreData";
import {getAuth} from 'firebase/auth';
import {doc, deleteDoc} from 'firebase/firestore';
import {db} from '../firebase';
import {useEffect, useState} from 'react';
import ReviewForm from "../components/Forms/ReviewForm";
import Loading from "../ui/Loading";
import { Link } from "react-router-dom";
import {toast} from 'react-toastify';

const Reviews = () => {
  const [editingReview, setEditingReview] = useState(null);

  const auth = getAuth();
  
  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError
  } = useGetFirestoreData('reviews', null, {lhs: 'userId', op: '==', rhs: auth.currentUser.uid});
  console.log(reviews)

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError
  } = useGetFirestoreData('products');

  const [userReviews, setUserReviews] = useState([]);
  
  useEffect(() => {
    if (reviews && products) {
      setUserReviews(reviews.map(review => {
        const matchingProduct = products.find(product => product.id === review.productId);
        return {
          reviewId: review.id,
          reviewText: review.text,
          reviewRating: review.rating,
          productId: matchingProduct.id,
          productImage: matchingProduct.image,
          productTitle: matchingProduct.title
        };
      }));
    }

    if ((reviewsError || productsError) && (!reviewsLoading && !productsLoading)) {
      toast.error('An error occurred!');
    }
  }, [products, productsError, productsLoading, reviews, reviewsError, reviewsLoading])
  
  if (reviewsLoading || productsLoading) {
    return <Loading />;
  }

  const deleteReviewHandler = async (review) => {
    try {
      const ref = doc(db, 'reviews', review.reviewId);
      await deleteDoc(ref);

      toast.success('Review deleted successfully!')
    } catch (error) {
      toast.error('An error occurred!')
    }
  };

  return (
    <>
      <div className='p-5 bg-gray-100 shadow-lg'>
        <div className='w-fit mb-5'>
          <h3 className='pb-2 text-xl font-semibold tracking-wide'>Your Reviews</h3>
          <div className='w-1/2 border border-orange-600'></div>
        </div>
          {
            userReviews.map(review => 
              editingReview !== userReviews.indexOf(review) ?
                <div key={review.productId} className='mb-6'>
                  <div className='flex flex-row gap-6'>
                    <Link to={`/product/${review.productId}`}>
                      <img src={review.productImage} alt='' className='w-36 h-36 object-cover border rounded-lg' />
                    </Link>
                    <div>
                      <Link to={`/product/${review.productId}`}>
                        <p className='mb-2 text-xl font-semibold tracking-wide'>{review.productTitle}</p>
                      </Link>
                      <ProductRating max={5} rating={review.reviewRating} className='mb-3 justify-center lg:justify-start'>
                        <p className='text-sm'>{review.date}</p>
                      </ProductRating>
                      <p className='max-w-3xl text-center lg:text-left tracking-wider leading-7'>{review.reviewText}</p>
                    </div>
                    <FaPen className='text-lg cursor-pointer transition duration-300 hover:text-orange-600 hover:scale-125' onClick={() => setEditingReview(userReviews.indexOf(review))}  />
                    <FiTrash2 className='text-lg cursor-pointer transition duration-300 hover:text-orange-600 hover:scale-125' onClick={() => deleteReviewHandler(review)} />
                  </div>
                </div>
              :
                <div  key={review.productId} className="mb-6">
                  <ReviewForm reviews={reviews} review={review} changeHandler={setEditingReview} />
                </div>
            )
          }
      </div>
    </>
  );
};

export default Reviews;