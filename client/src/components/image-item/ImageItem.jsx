import './image-item.css';
import { useState } from 'react';
import { CircularProgress, IconButton, ImageListItem, ImageListItemBar, Skeleton } from '@mui/material'
import { Block, HighlightOff } from '@mui/icons-material'
import { useDeleteImageMutation } from '../../features/images/imagesApiSlice';
import useConfirm from '../../hooks/useConfirm';

export default function ImageItem({ image, queryParams, preview, uploading, enlargeImage, handleRemoveImage }) {
    const [deleteImage, { isLoading: deleting }] = useDeleteImageMutation();
    const [deletedImage, setDeletedImage] = useState("");
    const [ConfirmationDialog, confirmDelete] = useConfirm(
        'Xoá ảnh?',
        'Bạn có muốn xoá tấm ảnh này?',
    )

    const handleDeleteImage = async () => {
        const confirmation = await confirmDelete()
        if (confirmation) {
            setDeletedImage(image?.name);
            await deleteImage({
                ...queryParams,
                name: image?.name,
                id: image?.id
            });
        } else {
            console.log('cancel delete');
        }
    }

    if (image) {
        if (!preview) {
            return (
                <ImageListItem sx={{ position: 'relative' }}>
                    <img
                        className="imageItem"
                        width="560"
                        height="380"
                        src={`${image.url}?w=575&fit=crop&auto=format`}
                        srcSet={`${image.url}?w=575&fit=crop&auto=format&dpr=2 2x`}
                        alt={image.name}
                        loading="lazy"
                        onClick={enlargeImage(image.url)}
                    />
                    <ImageListItemBar
                        sx={{
                            background:
                                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                        }}
                        title={image.name}
                        position="top"
                        actionIcon={
                            <IconButton
                                className="deleteImageButton"
                                sx={{ color: '#f25a5a' }}
                                aria-label={`delete ${image.name}`}
                                disabled={(deleting && deletedImage === image.name)}
                                onClick={handleDeleteImage}
                            >
                                <HighlightOff />
                            </IconButton>
                        }
                        actionPosition="left"
                    />
                    {(deleting && deletedImage === image.name) && (
                        <CircularProgress
                            size={40}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                padding: '5px',
                                marginTop: '-25px',
                                marginLeft: '-25px',
                                backgroundColor: '#000000a1',
                                borderRadius: '50%'
                            }}
                        />
                    )}
                <ConfirmationDialog />
                </ImageListItem>
            )
        } else {
            return (
                <ImageListItem>
                    <img
                        className="imageItem"
                        width="560"
                        height="380"
                        src={image.preview}
                        srcSet={image.preview}
                        alt={`preview ${image.name}`}
                        loading="lazy"
                        onLoad={() => { URL.revokeObjectURL(image.preview) }}
                    />
                    <ImageListItemBar
                        sx={{
                            background:
                                'linear-gradient(to bottom, rgba(252,227,0,0.7) 0%, ' +
                                'rgba(252,227,0,0.3) 70%, rgba(252,227,0,0) 100%)',
                        }}
                        title={`${uploading ? 'Đang tải ' : 'Xem trước '} ${image.name}`}
                        position="top"
                        actionIcon={
                            <IconButton
                                className="deleteImageButton"
                                sx={{ color: '#f25a5a' }}
                                aria-label={`remove ${image.name}`}
                                disabled={uploading}
                                onClick={() => handleRemoveImage(image.name)}
                            >
                                <Block />
                            </IconButton>
                        }
                        actionPosition="left"
                    />
                    {uploading && (
                        <CircularProgress
                            size={40}
                            color="secondary"
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                padding: '5px',
                                marginTop: '-25px',
                                marginLeft: '-25px',
                                backgroundColor: '#000000a1',
                                borderRadius: '50%'
                            }}
                        />
                    )}
                </ImageListItem>
            )
        }
    } else {
        <ImageListItem sx={{ position: 'relative' }}>
            <Skeleton variant="rectangular" height={Math.floor(Math.random() * (420 - 250 + 1)) + 250} />
            <ImageListItemBar
                sx={{
                    background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                }}
                title={"Đang tải..."}
                position="top"
                actionPosition="left"
            />
        </ImageListItem>
    }
}
