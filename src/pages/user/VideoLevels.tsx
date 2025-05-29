import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LevelSelector from "../../components/Selector/LevelSelector";
import { useState } from "react";

function VideoLevels() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState("");

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    if (level) navigate(`/dashboard/videos/by-level/${level}`);
  };

  return (
    <motion.div
      className="max-w-screen-md mx-auto px-4 py-14 mt-[100px] text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
        <img
        src="/images/video.png"
        className="mx-auto my-6 max-w-[300px] w-full h-auto"
        alt="Teacher icon"
        data-aos="flip-left"
      />

      <LevelSelector
        level={selectedLevel}
        onChange={handleLevelChange}
        showAllOption={false}
      />
    </motion.div>
  );
}

export default VideoLevels;
