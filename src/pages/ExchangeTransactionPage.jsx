import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../common/color';
import TransactionChat from '../components/chat/TransactionChat';
import { useLocation, useParams } from 'react-router-dom';
import useProduct from '../hooks/useProduct';
import { db } from '../config/firebase';
import ChattingInfo from '../components/chat/ChattingInfo';
import Tag from '../components/common/Tag';
import Loading from '../components/common/Loading';
import useUser from '../hooks/useUser';
import { timestampToDateFormat } from '../common/date';
import { moneyFormat } from '../common/money';
import ChattingHeader from '../components/chat/ChattingHeader';

const ExchangeTransactionPage = () => {
  const params = useParams();
  const exchangerUid = params.id;
  const productId = params.productId;
  const [product, setProduct] = useState(null);
  const [type, setType] = useState(null);

  const fetchProduct = async () => {
    try {
      setType(2);
      const exchangeDoc = await db.collection('exchange').doc(productId);
      exchangeDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        setProduct({ ...data, id: snapshot.id });
      });
    } catch (err) {
      console.log('fetchProduct err: ', err);
    }
  };
  useEffect(() => {
    //console.log(params.productId);
    fetchProduct();
  }, []);

  useEffect(() => {
    if (product) {
      fetchProduct();
    }
  }, [product]);

  if (!product) {
    return <Loading />;
  }

  return (
    <div>
      <ChattingHeader product={product} />
      <div style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
        <ChattingInfo product={product}>
          <button>교환 완료하기</button>
          <Tag
            label="거래방법"
            text={product.transactionType}
            textColor={colors.COLOR_MAIN}
          />
          <Tag
            label="지역"
            text={product.region}
            textColor={colors.COLOR_MAIN}
          />
        </ChattingInfo>
        <div>
          {type !== null && ( // type이 null이 아닐 때 렌더링
            <TransactionChat productId={productId} type={type} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangeTransactionPage;
