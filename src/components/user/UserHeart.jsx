import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartOutlined } from "@fortawesome/free-regular-svg-icons";

import {useIsLike, plusProductLike ,miusProductLike, useLike, Like2} from "../../hooks/useHeart";
import useUser from "../../hooks/useUser";

import { colors } from "../../common/color";
import { db } from "../../config/firebase";


const UserHeart = ({
  product,
  onClick = null,
  
}) => {
  const user = useUser();
  let arrayDataHook = useLike(user);
  const isLike = useIsLike(product.id, arrayDataHook);
  const [heart, setHeart] = useState(false);
 
  
  useEffect(()=>{
    setHeart(isLike);
  },[isLike]);

  
  const HandleHeart = async()=> {
    const productDB = db.collection("likes");
    arrayDataHook = await Like2(user);
    
    setHeart(!heart);
        
    if (!heart) {
      if (arrayDataHook.indexOf(product.id)<0) {
      
        const newArrayData =[...arrayDataHook, product.id ];
        await productDB.doc(user.uid).update({ products: newArrayData });
        plusProductLike(product.id);
      }
    }
    else{
      if(arrayDataHook.includes(product.id)){
        const index = arrayDataHook.indexOf(product.id);
        const removeArrayData = [...arrayDataHook.slice(0, index), 
          ...arrayDataHook.slice(index + 1)];
        await productDB.doc(user.uid).update({ products: removeArrayData });
        miusProductLike(product.id);
      }
    }
    
    
  };

  
  return (
    <FontAwesomeIcon onClick={HandleHeart} icon={heart ? faHeart : faHeartOutlined} style={heartStyle} />
  );
};

export default UserHeart;

export const ImageSizeTable = {
  S: "100px",
  M: "200px",
  L: "300px",
};

const BorderRadisSizeTable = {
  S: "5px",
  M: "10px",
  L: "15px",
};


const heartStyle = {
  color: colors.COLOR_HEART,
  fontSize: "28px",
  cursor: "pointer",
};
