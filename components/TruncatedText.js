import React from "react";
import { Text } from "react-native";

const TruncatedText = ({ text, maxLength, style }) => {
  if (!text || text.length <= maxLength) {
    return <Text style={style}>{text}</Text>;
  }

  const truncatedText = `${text.substring(0, maxLength)}...`;
  return <Text style={style}>{truncatedText}</Text>;
};

export default TruncatedText;
