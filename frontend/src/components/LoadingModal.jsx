// import styled from "styled-components";

// const LoadingModal = () => {
//   return (
//     <ModalOverlay>
//       <ModalContent>
//         <Loader />
//         <p>Checking Compatibility...</p>
//       </ModalContent>
//     </ModalOverlay>
//   );
// };

// export default LoadingModal;

// // STYLED COMPONENTS
// const ModalOverlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background: rgba(0, 0, 0, 0.6);
//   z-index: 1000;
// `;

// const ModalContent = styled.div`
//   background: rgba(25, 153, 180, 0.85);
//   padding: 20px;
//   border-radius: 12px;
//   text-align: center;
//   color: white;
//   backdrop-filter: blur(10px);
// `;

// const Loader = styled.div`
//   width: 40px;
//   height: 40px;
//   border: 5px solid white;
//   border-top: 5px solid #ffeb3b;
//   border-radius: 50%;
//   animation: spin 1s linear infinite;

//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
// `;

import styled, { keyframes } from "styled-components";

const LoadingModal = ({ isLoading, userZodiac, loverZodiac }) => {
  if (!isLoading) return null;

  console.log(userZodiac, loverZodiac);

  return (
    <ModalOverlay>
      <ModalContent>
        <SignText>
          {userZodiac?.sign} 💞 {loverZodiac?.sign}
        </SignText>
        <ImageContainer>
          {userZodiac?.image && <img src={userZodiac.image} alt="User Zodiac" />}
          <span>💞</span>
          {loverZodiac?.image && <img src={loverZodiac.image} alt="Lover Zodiac" />}
        </ImageContainer>
        <p>Checking Compatibility...</p>
        <Spinner />
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoadingModal;

// Styled Components for Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  text-align: center;
  border: 2px solid rgba(0, 168, 232, 0.5);
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  background: rgba(0, 0, 0, 0.6);
  box-shadow: 0px 12px 30px rgba(0, 168, 232, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SignText = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 2px;
  font-weight: bold;
  color: #4f46e5;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;

  img {
    width: 150px;
    height: 150px;
    object-fit: contain;
  }

  span {
    font-size: 24px;
  }
`;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 30px;
  height: 30px;
  border: 4px solid #4f46e5;
  border-top: 4px solid transparent;
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
  margin-top: 15px;
`;
