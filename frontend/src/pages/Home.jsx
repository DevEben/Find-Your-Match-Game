// import { useState } from "react";
// import styled from "styled-components";
// import ZodiacForm from "../components/ZodiacForm";
// import CompatibilityResult from "../components/CompatibilityResult";

// const Home = () => {
//   const [result, setResult] = useState(null);

//   return (
//     <Container>
//       <Content>
//         <ZodiacForm setResult={setResult} />
//         {result && <CompatibilityResult result={result} />}
//       </Content>
//     </Container>
//   );
// };

// export default Home;

// // STYLED COMPONENTS
// const Container = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   min-height: 100vh;
//   padding: 20px;
//   background: #0f172a;
// `;

// const Content = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 20px;
//   width: 100%;
//   max-width: 900px;

//   @media (min-width: 768px) {
//     flex-direction: row;
//     align-items: flex-start;
//   }
// `;


import { useState } from "react";
import styled from "styled-components";
import ZodiacForm from "../components/ZodiacForm";
import CompatibilityResult from "../components/CompatibilityResult";
import LoadingModal from "../components/LoadingModal";

const Home = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <Container>
      {loading && <LoadingModal />} {/* Show modal when loading */}
      <Content>
        <ZodiacForm setResult={setResult} setLoading={setLoading} />
        {result && <CompatibilityResult result={result} />}
      </Content>
    </Container>
  );
};

export default Home;

// STYLED COMPONENTS
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: #0f172a;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 900px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;
