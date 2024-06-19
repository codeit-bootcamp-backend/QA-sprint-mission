// import "./App.css";
import { useEffect, useState, useCallback } from "react";
import Nav from "../components/Nav";
import { getProducts, getBestProducts } from "utils/api";
import GeneralSection from "components/GeneralSection/GeneralSection";
import BestSection from "components/BestSection/BestSection";
import Footer from "components/Footer";

function Items() {
  const [cards, setCards] = useState([]);
  const [bestCards, setBestCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCards = useCallback(async () => {
    try {
      const productsList = await getProducts("/products");
      setCards(productsList.list);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchBestCards = useCallback(async () => {
    try {
      const BestList = await getBestProducts("/products");
      setBestCards(BestList.list);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchCards();
    fetchBestCards();
  }, [fetchCards, fetchBestCards]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Nav />
      <BestSection bestCards={bestCards} />
      <GeneralSection cards={filteredCards} onSearch={handleSearch} />
      <Footer />
    </div>
  );
}

export default Items;
