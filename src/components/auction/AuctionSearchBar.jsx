import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { colors } from "../../common/color";
import { Category } from "../../constants/category";
import { IdolList } from "../../constants/idol";
import DropDownMenu from "../common/DropDownMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import useUser from "../../hooks/useUser";
import SearchArea from "../common/SearchArea";
import SearchBar from "../common/SearchBar";

const height = "28px";
const fontSize = "12px";

const AuctionSearchBar = ({ setProducts }) => {
  const user = useUser();
  const [idol, setIdol] = useState("내가 찾는 아이돌");
  const [category, setCategory] = useState("굿즈 종류");

  const [input, setInput] = useState("");

  const navigate = useNavigate();

  const goAuctionUpPage = () => {
    navigate("/auction/post");
  };

  const handleSearch = async () => {
    const productDB = collection(db, "product");

    try {
      const q = query(
        productDB,
        where("category", "==", category),
        where("idol", "==", idol),
        where("isComplete", "==", 0),
        orderBy("title"),
        where("title",">=",input),
        where("title","<=","input"+"\uf8ff")
        
      );
      const ret = await getDocs(q);
      const products = ret.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(products);
    } catch (err) {
      console.log("err:", err);
    }
  };

  const onChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };
  const onKeyUp = (e) => {
    if (e.key === "Enter") {
      //onClick();
    }
  };


  return (
    <Container>
      <Inner>
        <Wrapper>
          <DropDownMenu
            width="150px"
            height={height}
            fontSize={fontSize}
            margin="0 5px 0 0"
            list={IdolList}
            selected={idol}
            setSelected={setIdol}
          />
          <DropDownMenu
            width="150px"
            height={height}
            fontSize={fontSize}
            margin="0 5px 0 0"
            list={Category}
            selected={category}
            setSelected={setCategory}
          />
          <SearchInputDiv>

          <SearchInput
            placeholder="어떤 상품을 찾으시나요?"
            value={input}
            onChange={onChange}
            onKeyUp={onKeyUp}
          />

          
        </SearchInputDiv>

          {/* <SearchBar input={input} setInput={setInput} onClick={() => {}} /> */}
        </Wrapper>

        <BtnWrap>
          <Btn onClick={handleSearch}>
            검색하기
            <FontAwesomeIcon icon={faSearch} style={{ paddingLeft: "7px" }} />
          </Btn>

          {user && (
            <Btn onClick={goAuctionUpPage}>
              <FontAwesomeIcon icon={faPen} />
            </Btn>
          )}
        </BtnWrap>
      </Inner>
    </Container>
  );
};

export default AuctionSearchBar;

const Container = styled.div`
  width: 100%;
  background-color: ${colors.COLOR_LIGHTGREEN_BACKGROUND};
  padding: 10px 0;
`;

const Inner = styled.div`
  width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BtnWrap = styled.div`
  display: flex;
  align-items: center;
`;

const Btn = styled.p`
  box-sizing: border-box;
  background-color: ${colors.COLOR_MAIN};
  color: white;
  font-weight: bold;
  height: ${height};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  margin-left: 5px;
  border-radius: 5px;
  font-size: ${fontSize};
  border: 1px solid ${colors.COLOR_MAIN};
  cursor: pointer;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  // background-color: orange;
`;


const SearchInputDiv = styled.div`
  width: max-content;
  position: relative;
  height: 28px;
  margin-right: 5px;
  //   background-color: aqua;
`;
const SearchInput = styled.input`
  box-sizing: border-box;
  background-color: ${colors.COLOR_LIGHTGRAY_BACKGROUND};
  width: 220px;
  height: 100%;
  border-radius: 30px;
  border: 1px solid ${colors.COLOR_MAIN};
  //   border: 1px solid ${colors.COLOR_GRAY_BORDER};
  display: flex;
  align-items: center;
  padding: 0 32px 0 15px;
  font-size: 12px;
`;

const SearchIcon = styled.div`
  //   background-color: orange;
  cursor: pointer;
  height: 100%;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 5px;
  font-size: 12px;
  color: ${colors.COLOR_MAIN};
`;
