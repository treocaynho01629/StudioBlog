import { useGetVideosQuery } from '../../features/google/googleApiSlice';
import YoutubeEmbed from '../youtube-embed/YoutubeEmbed';

export default function YoutubeList({ amount, refetchOnMountOrArgChange }) {
    const { data: videos, isLoading, isSuccess, isError } = useGetVideosQuery(
        { amount: amount ?? 5 },
        { refetchOnMountOrArgChange: refetchOnMountOrArgChange ?? false }
    );

    let videosList;

    if (isLoading || isError) {
        videosList = [...new Array(amount ?? 5)].map((element, index) => {
            return (
                <YoutubeEmbed key={index} />
            )
        })
    } else if (isSuccess) {
        videosList = videos?.length
            ? videos.map(video => (
                <YoutubeEmbed key={video.id} video={video} />
            ))
            : [...new Array(amount ?? 5)].map((element, index) => (
                    <YoutubeEmbed key={index} />
            ))
    }

    return (
        <div className="youtubeContainer">
            {videosList}
        </div>
    );
}
