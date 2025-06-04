import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import LevelSelector from "../../components/Selector/LevelSelector"; 

function LevelSelect() {
  const navigate = useNavigate(); 

  return (
    // Wrapper med fade-in animation och Tailwind-design
    <motion.div
      className="max-w-screen-md mx-auto px-6 py-20 mt-[100px] text-center bg-white rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}  
      transition={{ duration: 0.5 }}   
    >

      {/* Illustrationsbild */}
      <img
        src="/images/test.png"
        className="mx-auto my-6 max-w-[300px] w-full h-auto rounded-lg"
        alt="Test illustration"
        data-aos="flip-left" // AOS-animation vid scroll
      />

      {/* Nivåväljare som navigerar användaren till testsidan för vald nivå */}
      <div className="mt-10">
        <LevelSelector
          level={""}
          onChange={(value) => navigate(`/dashboard/tests/${value}`)} // Navigerar till test-sidan för vald nivå
          showAllOption={false} 
        />
      </div>
    </motion.div>
  );
}

export default LevelSelect;
