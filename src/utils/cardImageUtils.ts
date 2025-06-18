
export const getCardImage = (cardName: string) => {
  const lowerCardName = cardName.toLowerCase();
  if (lowerCardName.includes('hilton')) {
    return "https://www.aexp-static.com/online/myca/shared/summary/cardasset/images/NUS000000336_480x304_STRAIGHT_96.jpg";
  } else if (lowerCardName.includes('bonvoy') || lowerCardName.includes('marriott')) {
    return "https://i.imgur.com/5MsJHUL.jpeg";
  } else if (lowerCardName.includes('delta')) {
    return "https://www.aexp-static.com/online/myca/shared/summary/cardasset/images/NUS000000270_480x304_STRAIGHT_96.jpg";
  } else if (lowerCardName.includes('amazon')) {
    return "https://www.aexp-static.com/online/myca/shared/summary/cardasset/images/NUS000000251_480x304_STRAIGHT_96.jpg";
  } else if (lowerCardName.includes('business platinum')) {
    return "https://i.imgur.com/PO79ixr.jpeg";
  } else if (lowerCardName.includes('platinum')) {
    return "https://i.imgur.com/h5alF7K.png";
  } else if (lowerCardName.includes('blue')) {
    return "https://i.imgur.com/DOm8KGF.jpeg";
  } else if (lowerCardName.includes('green')) {
    return "https://i.imgur.com/fAK8uEB.png";
  } else if (lowerCardName.includes('schwab')) {
    return "https://www.aexp-static.com/online/myca/shared/summary/cardasset/images/NUS000000242_480x304_STRAIGHT_96.jpg";
  } else if (lowerCardName.includes('rose gold')) {
    return "https://i.imgur.com/4zwqhph.jpeg";
  } else if (lowerCardName.includes('standard')) {
    return "https://i.imgur.com/6P2YZCw.png";
  } else if (lowerCardName.includes('bloc') || lowerCardName.includes('checking')) {
    return "https://www.aexp-static.com/online/myca/shared/summary/cardasset/images/NUS000000283_S3.png";
  } else if (lowerCardName.includes('white gold')) {
    return "https://i.imgur.com/BvemgNT.png";
  } else if (lowerCardName.includes('gold')) {
    if (lowerCardName.includes('-2008')) {
      return "https://i.imgur.com/4zwqhph.jpeg";
    } else if (lowerCardName.includes('-1002')) {
      return "https://i.imgur.com/QLjcloI.jpeg";
    } else if (lowerCardName.includes('-1000')) {
      return "https://i.imgur.com/BvemgNT.png";
    }
    return "https://i.imgur.com/QLjcloI.jpeg"; // fallback for other gold cards
  }
  return "https://i.imgur.com/4zwqhph.jpeg"; // default image
};
