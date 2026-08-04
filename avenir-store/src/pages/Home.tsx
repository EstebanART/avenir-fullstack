import ProductList from '../components/ProductList';

const Home = () => {
  console.log('HOME RENDER');
  return (
    <div>
      <h1>Avenir Store</h1>
      <h3>Bienvenido a Avenir Store, tu tienda en línea de confianza para productos de calidad.</h3>
      <ProductList />
    </div>
  );
};

export default Home;
