import VideoListItem from "./VideoListItem";

// Typdefinition för props som komponenten tar emot
interface Props {
  videos: any[];                       
  favorites: number[];              
  visibleId: number | null;           
  onToggleFavorite: (id: number) => void;       // Funktion för att lägga till/ta bort favorit
  onToggleDescription: (id: number) => void;    // Funktion för att visa/dölja beskrivning
}

// Komponent som renderar en lista av videor
const VideoList = ({
  videos,
  favorites,
  visibleId,
  onToggleFavorite,
  onToggleDescription,
}: Props) => (
  <ul className="space-y-6 mt-6">
    {/* Gå igenom alla videor och rendera varje som en VideoListItem */}
    {videos.map((video) => (
      <VideoListItem
        key={video.id}                               
        video={video}                                 
        isFavorite={favorites.includes(video.id)}    
        onToggleFavorite={onToggleFavorite}            
        isDescriptionVisible={visibleId === video.id} 
        onToggleDescription={onToggleDescription}     
      />
    ))}
  </ul>
);

export default VideoList;
