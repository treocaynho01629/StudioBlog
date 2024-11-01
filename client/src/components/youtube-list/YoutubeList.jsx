import { Fragment } from 'react';
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
                <Fragment key={index}>
                    <YoutubeEmbed />
                </Fragment>
            )
        })
    } else if (isSuccess) {
        videosList = videos?.length
            ? videos.map(video => (
                <Fragment key={video.videoId}>
                    <YoutubeEmbed video={video} />
                </Fragment>
            ))
            : [...new Array(amount ?? 5)].map((element, index) => (
                <Fragment key={index}>
                    <YoutubeEmbed />
                </Fragment>
            ))
    }

    return (
        <div className="youtubeContainer">
            {videosList}
        </div>
    );
}
