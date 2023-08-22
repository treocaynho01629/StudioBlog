import './images.css';
import { Box, CircularProgress, Container, Dialog, DialogContent, IconButton, ImageList, ImageListItem, ImageListItemBar, Skeleton, useMediaQuery, useTheme } from '@mui/material'
import { AddCircleOutline as AddCircleOutlineIcon, HighlightOff, Block, CheckCircleOutline } from '@mui/icons-material';
import { useDeleteImageMutation, useGetImagesQuery, useUploadImagesMutation } from '../../features/images/imagesApiSlice'
import { useEffect, useRef, useState } from 'react';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import useConfirm from '../../hooks/useConfirm';
import useTitle from '../../hooks/useTitle';

const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif', 'svg'],
    sizeLimit = 5_242_880; //5MB

export default function Images() {
    useTitle(`Kho ảnh - TAM PRODUCTION`);
    const theme = useTheme();
    const phoneBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
    const { data: images, isLoading, isError, isSuccess } = useGetImagesQuery({
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });
    const [uploadImages, { isLoading: uploading }] = useUploadImagesMutation();
    const [deleteImage, { isLoading: deleting }] = useDeleteImageMutation();
    const [deletedImage, setDeletedImage] = useState("");
    const [files, setFiles] = useState([]);
    const [errMsg, setErrMsg] = useState("");
    const inputFile = useRef(null);
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState("");
    const [ConfirmationDialog, confirmDelete] = useConfirm(
        'Xoá ảnh?',
        'Bạn có muốn xoá tấm ảnh này?',
    )

    useEffect(() => {
        return () => files.forEach(file => URL.revokeObjectURL(file.preview)); //prevent memory leaks
    }, []);

    const handleDeleteImage = async (name) => {
        const confirmation = await confirmDelete()
        if (confirmation) {
            setDeletedImage(name);
            await deleteImage(name).unwrap();
        } else {
            console.log('cancel delete');
        }
    }

    const handleChangeImages = (e) => {
        const files = e.target.files;

        //Pre validation
        if (files && files.length <= 10) {
            let errors = "";

            for (var i = 0; i < files.length; i++) {
                const file = files[i];
                const { name: fileName, size: fileSize } = file;
                const fileExtension = fileName.split(".").pop();

                if (!allowedExtensions.includes(fileExtension)) {
                    errors += `${fileName} sai định dạng ảnh!\n`;
                } else if (fileSize > sizeLimit) {
                    errors += `${fileName} kích thước quá lớn!\n`;
                } else {
                    setFiles(current => [...current, Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })]);
                }
            }
            setErrMsg(errors);
        } else {
            setErrMsg('Tối đa 10 ảnh một lúc!');
        }
    }

    const handleRemoveImage = (name) => {
        const newFiles = files.filter((file) => file.name !== name);
        setFiles(newFiles);
    }

    const handleUploadImages = async () => {
        if (files.length === 0) return;
        const form = new FormData();

        files.forEach((file, i) => {
            form.append('file', file, file.name);
        });

        await uploadImages(form).unwrap();
        setFiles([]);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const enlargeImage = (url) => (e) => {
        setImage(url);
        setOpen(true);
    }

    const handleOpenFile = () => {
        inputFile.current.click();
        setErrMsg("");
    }

    let content;
    if (isLoading) {
        content = [...new Array(8)].map((element, index) => {
            return (
                <ImageListItem key={index} sx={{ position: 'relative' }}>
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
            )
        })
    } else if (isSuccess) {
        content = images?.length
            ? images?.map((item) => (
                <ImageListItem key={item.url} sx={{ position: 'relative' }}>
                    <img
                        src={`${item.url}?w=575&fit=crop&auto=format`}
                        srcSet={`${item.url}?w=575&fit=crop&auto=format&dpr=2 2x`}
                        alt={item.name}
                        loading="lazy"
                        onClick={enlargeImage(item.url)}
                    />
                    <ImageListItemBar
                        sx={{
                            background:
                                'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                        }}
                        title={item.name}
                        position="top"
                        actionIcon={
                            <IconButton
                                className="deleteImageButton"
                                sx={{ color: '#f25a5a' }}
                                aria-label={`delete ${item.name}`}
                                disabled={(deleting && deletedImage === item.name)}
                                onClick={() => handleDeleteImage(item.name)}
                            >
                                <HighlightOff />
                            </IconButton>
                        }
                        actionPosition="left"
                    />
                    {(deleting && deletedImage === item.name) && (
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
                </ImageListItem>
            ))
            : <p>Không có hình ảnh nào</p>
    } else if (isError) {
        content = <p>Đã xảy ra lỗi khi tải ảnh!</p>
    }

    const preview = files?.map((item) => (
        <ImageListItem key={item.preview}>
            <img
                src={item.preview}
                srcSet={item.preview}
                alt={`preview ${item.name}`}
                loading="lazy"
                onLoad={() => { URL.revokeObjectURL(item.preview) }}
            />
            <ImageListItemBar
                sx={{
                    background:
                        'linear-gradient(to bottom, rgba(252,227,0,0.7) 0%, ' +
                        'rgba(252,227,0,0.3) 70%, rgba(252,227,0,0) 100%)',
                }}
                title={`${uploading ? 'Đang tải ' : 'Xem trước '} ${item.name}`}
                position="top"
                actionIcon={
                    <IconButton
                        className="deleteImageButton"
                        sx={{ color: '#f25a5a' }}
                        aria-label={`remove ${item.name}`}
                        disabled={uploading}
                        onClick={() => handleRemoveImage(item.name)}
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
    ))

    return (
        <div className="imagesContainer">
            <Container fluid maxWidth="lg">
                <BreadCrumbs route={'Kho ảnh'} />
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <h1 className="alternativeTitle">KHO ẢNH</h1>
                    {files.length !== 0 ?
                        <button className="addButton" disabled={uploading} onClick={handleUploadImages}>
                            <CheckCircleOutline sx={{ marginRight: 1 }} />
                            Xác nhận
                            {uploading && (
                                <CircularProgress
                                    size={22}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                />
                            )}
                        </button>
                        :
                        <Box className="addButton" onClick={handleOpenFile}>
                            <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
                            Tải ảnh lên
                        </Box>
                    }
                </Box>
                <input
                    required
                    type="file"
                    name='files[]'
                    multiple="multiple"
                    id="fileInput"
                    accept="image/*"
                    ref={inputFile}
                    style={{ display: "none" }}
                    onChange={handleChangeImages}
                />
                {errMsg && <span className="errorMsg">{errMsg}</span>}
                <Box sx={{ width: 'auto', height: 900, overflowY: 'scroll' }}>
                    <ImageList variant="masonry" cols={phoneBreakpoint ? 1 : 2} gap={6}>
                        {content}
                        {preview}
                    </ImageList>
                </Box>
                <ConfirmationDialog />
            </Container>
            <Dialog
                fullScreen={phoneBreakpoint}
                fullWidth
                keepMounted
                maxWidth="xl"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
            >
                <DialogContent sx={{display: 'flex', alignItems: 'center'}}>
                    { image ?
                        <img className="imageEnlarge" 
                        loading="lazy"
                        src={image}
                        />
                        : null
                    }
                </DialogContent>
            </Dialog>
        </div>
    )
}
