import PropTypes from "prop-types";
import { FiTrash2 } from "react-icons/fi";
import useProductActions from "../../../../hooks/useProductActions";

const ProductDeleteIcon = ({ id }) => {
  const { removeFromCart } = useProductActions();

  const removeFromCartHandler = () => {
    removeFromCart(id);
  };

  return (
    <FiTrash2
      className="text-xl font-semibold -translate-y-0.5 cursor-pointer transition duration-500 hover:text-orange-600 hover:scale-110"
      onClick={removeFromCartHandler}
    />
  );
};

ProductDeleteIcon.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ProductDeleteIcon;
