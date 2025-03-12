import styled from "styled-components";

const CompatibilityResult = ({ result }) => {
  if (!result) return null;

  return (
    <ResultContainer>
      <Title>🔮 Compatibility Report</Title>
      <Names>
        <span>{result?.user?.name} <Zodiac>({result?.user?.zodiac})</Zodiac></span>
        <span>💞</span>
        <span>{result?.lover?.name} <Zodiac>({result?.lover?.zodiac})</Zodiac></span>
      </Names>
      <MatchScore>❤️ Match Score: {result?.matchScore}%</MatchScore>
      <Description>💬 {result?.matchDescription}</Description>
      <Advice>💡 Advice: {result?.relationshipAdvice}</Advice>
    </ResultContainer>
  );
};

export default CompatibilityResult;

// STYLED COMPONENTS
const ResultContainer = styled.div`
  background: rgba(25, 153, 180, 0.15); /* Glassy Turquoise */
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  color: #fff;
//   box-shadow: 0px 8px 20px rgba(0, 168, 232, 0.3);
  animation: fadeIn 0.5s ease-in-out;
  transition: transform 0.3s ease;

//   &:hover {
//     transform: scale(1.03);
//     box-shadow: 0px 12px 30px rgba(0, 168, 232, 0.5);
//   }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    max-width: 90%;
    padding: 15px;
  }
`;

const Title = styled.h2`
  font-size: 1.6rem;
  margin-bottom: 10px;
  font-weight: bold;
  color: #e0f7fa; /* Light cyan */
`;

const Names = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 1.3rem;
  font-weight: bold;
`;

const Zodiac = styled.span`
  font-size: 1rem;
  font-weight: normal;
  opacity: 0.85;
  color: #b3e5fc; /* Sky Blue */
`;

const MatchScore = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 10px 0;
  color: #ffeb3b; /* Yellow */
`;

const Description = styled.p`
  font-size: 0.9rem;
  margin: 10px 0;
  opacity: 0.9;
`;

const Advice = styled.p`
  font-size: 0.9rem;
  margin-top: 15px;
  font-style: italic;
  opacity: 0.85;
`;
