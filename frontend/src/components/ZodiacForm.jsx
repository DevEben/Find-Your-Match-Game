import { useState } from "react";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import LoadingModal from "./LoadingModal";
import zodiacImages from "../utils/zodiacImages";



// Function to determine zodiac sign based on day and month
const getZodiacSign = (day, month) => {
    const zodiacSigns = [
      { sign: "Capricorn", image: zodiacImages.Capricorn, start: [12, 22], end: [1, 19] },
      { sign: "Aquarius", image: zodiacImages.Aquarius, start: [1, 20], end: [2, 18] },
      { sign: "Pisces", image: zodiacImages.Pisces, start: [2, 19], end: [3, 20] },
      { sign: "Aries", image: zodiacImages.Aries, start: [3, 21], end: [4, 19] },
      { sign: "Taurus", image: zodiacImages.Taurus, start: [4, 20], end: [5, 20] },
      { sign: "Gemini", image: zodiacImages.Gemini, start: [5, 21], end: [6, 20] },
      { sign: "Cancer", image: zodiacImages.Cancer, start: [6, 21], end: [7, 22] },
      { sign: "Leo", image: zodiacImages.Leo, start: [7, 23], end: [8, 22] },
      { sign: "Virgo", image: zodiacImages.Virgo, start: [8, 23], end: [9, 22] },
      { sign: "Libra", image: zodiacImages.Libra, start: [9, 23], end: [10, 22] },
      { sign: "Scorpio", image: zodiacImages.Scorpio, start: [10, 23], end: [11, 21] },
      { sign: "Sagittarius", image: zodiacImages.Sagittarius, start: [11, 22], end: [12, 21] },
    ];
  
    return zodiacSigns.find(
      ({ start, end }) =>
        (month === start[0] && day >= start[1]) || (month === end[0] && day <= end[1])
    );
  };


const ZodiacForm = ({ setResult }) => {
  const [formData, setFormData] = useState({
    userName: "",
    userDay: "",
    userMonth: "",
    loverName: "",
    loverDay: "",
    loverMonth: "",
  });

  const [loading, setLoading] = useState(false);
  const [userZodiac, setUserZodiac] = useState("");
  const [loverZodiac, setLoverZodiac] = useState("");

  // Generates array for days (1-31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Months as an array of objects (for name and value)
  const months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userSign = getZodiacSign(Number(formData.userDay), Number(formData.userMonth));
    const loverSign = getZodiacSign(Number(formData.loverDay), Number(formData.loverMonth));

    setUserZodiac(userSign);
    setLoverZodiac(loverSign);

    try {
      const response = await axios.post("http://localhost:3682/api/v1/check-compatibility", {
        userName: formData.userName,
        loverName: formData.loverName,
        userDOB: { day: Number(formData.userDay), month: Number(formData.userMonth) },
        loverDOB: { day: Number(formData.loverDay), month: Number(formData.loverMonth) },
      });

      setResult(response.data.data);
    } catch (error) {
      console.error("Error fetching compatibility:", error);
    }

    setLoading(false);
  };

  return (
    <>
      <FormContainer onSubmit={handleSubmit}>
        <h2>🔮 Check Your Zodiac Compatibility</h2>

        <InputWrapper>
          <label>Your Name</label>
          <input type="text" name="userName" value={formData.userName} onChange={handleChange} required />
        </InputWrapper>

        <InputWrapper>
          <label>Your Birthday</label>
          <SelectContainer>
            <select name="userDay" value={formData.userDay} onChange={handleChange} required>
              <option value="">Day</option>
              {days.map((day) => <option key={day} value={day}>{day}</option>)}
            </select>
            <select name="userMonth" value={formData.userMonth} onChange={handleChange} required>
              <option value="">Month</option>
              {months.map((month) => <option key={month.value} value={month.value}>{month.name}</option>)}
            </select>
          </SelectContainer>
        </InputWrapper>

        <InputWrapper>
          <label>Lover's Name</label>
          <input type="text" name="loverName" value={formData.loverName} onChange={handleChange} required />
        </InputWrapper>

        <InputWrapper>
          <label>Lover's Birthday</label>
          <SelectContainer>
            <select name="loverDay" value={formData.loverDay} onChange={handleChange} required>
              <option value="">Day</option>
              {days.map((day) => <option key={day} value={day}>{day}</option>)}
            </select>
            <select name="loverMonth" value={formData.loverMonth} onChange={handleChange} required>
              <option value="">Month</option>
              {months.map((month) => <option key={month.value} value={month.value}>{month.name}</option>)}
            </select>
          </SelectContainer>
        </InputWrapper>

        <SubmitButton type="submit">
          Check Compatibility <FaStar />
        </SubmitButton>
      </FormContainer>

      <LoadingModal isLoading={loading} userZodiac={userZodiac} loverZodiac={loverZodiac} />
    </>
  );
};

export default ZodiacForm;

// STYLED COMPONENTS
const FormContainer = styled.form`
  background: #1e293b;
  padding: 25px;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  color: white;
  margin: auto;
  
  h2 {
    margin-bottom: 20px;
    font-size: 20px;
  }
`;

const InputWrapper = styled.div`
  margin: 12px 0;
  text-align: left;

  label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 6px;
    outline: none;
    font-size: 14px;
    background: #334155;
    color: white;
  }
`;

const SelectContainer = styled.div`
  display: flex;
  gap: 10px;

  select {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 6px;
    outline: none;
    font-size: 14px;
    background: #334155;
    color: white;
    cursor: pointer;
  }
`;

const SubmitButton = styled.button`
  background: #4f46e5;
  color: white;
  border: none;
  padding: 12px 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 6px;
  font-size: 16px;
  margin-top: 15px;
  width: 100%;
  transition: background 0.3s;

  &:hover {
    background: #4338ca;
  }

  &:disabled {
    background: gray;
    cursor: not-allowed;
  }
`;
