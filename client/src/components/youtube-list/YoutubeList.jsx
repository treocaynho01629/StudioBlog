import { useGetVideosQuery } from '../../features/google/googleApiSlice';
import YoutubeEmbed from '../youtube-embed/YoutubeEmbed';

export default function YoutubeList({ amount }) {
    const { data: videos, isLoading, isSuccess, isError, error } = useGetVideosQuery({amount: amount ?? 5 });

    let content;

    if (isLoading) {
        content = <p>Loading ...</p>
    } else if (isSuccess) {
        const videosList = videos?.length
            ? videos.map(video => (
                <YoutubeEmbed key={video.id} video={video} />
            ))
            : null

        content = (
            <div className="youtubeContainer">
                {videosList}
            </div>
        )
    } else if (isError){
        content = <p>{error}</p>
    }

  return content;
}
