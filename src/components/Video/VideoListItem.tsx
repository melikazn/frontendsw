import { FaHeart } from "react-icons/fa";        
import { motion } from "framer-motion";      

// Props som komponenten tar emot
interface Props {
  video: any;                                    
  isFavorite: boolean;                         
  onToggleFavorite: (id: number) => void;            // Funktion för att toggla favoritstatus
  isDescriptionVisible: boolean;                  
  onToggleDescription: (id: number) => void;         // Funktion för att toggla visning av beskrivning
}

// Själva komponenten
const VideoListItem = ({
  video,
  isFavorite,
  onToggleFavorite,
  isDescriptionVisible,
  onToggleDescription,
}: Props) => (
  // Animerad listpost med gul bakgrund
  <motion.li
    className="bg-yellow-100 p-6 rounded-2xl shadow-md cursor-pointer"
    initial={{ opacity: 0, y: 10 }}                  
    animate={{ opacity: 1, y: 0 }}                    
    transition={{ duration: 0.4 }}                   
  >
    <div className="flex items-center gap-3">
      {/* Hjärtikon för att lägga till/ta bort favorit */}
      <button onClick={() => onToggleFavorite(video.id)}>
        <FaHeart color={isFavorite ? "red" : "#ccc"} />
      </button>

      {/* Videotitel som kan klickas för att visa beskrivning/video */}
      <h3
        onClick={() => onToggleDescription(video.id)}
        className="text-blue-600 font-semibold hover:underline"
      >
        {video.title}
      </h3>
    </div>

    {/* Visa resten endast om denna video är "öppen" */}
    {isDescriptionVisible && (
      <div className="mt-3 space-y-2">
        {/* Videobeskrivning */}
        <p>{video.description}</p>

        {/* Visar vilken sektion videon tillhör */}
        <p className="text-sm text-gray-600 font-medium">
          📁 Sektion: {video.section_name}
        </p>

        {/* Videospelare */}
        <video className="w-full max-w-xl rounded-xl shadow" controls>
          <source src={video.video_url} type="video/mp4" />
        </video>

        {/* Uppladdningsdatum */}
        <p className="text-xs text-gray-500">
          📅 Uppladdad: {new Date(video.uploaded_at).toLocaleString()}
        </p>
      </div>
    )}
  </motion.li>
);

export default VideoListItem;
