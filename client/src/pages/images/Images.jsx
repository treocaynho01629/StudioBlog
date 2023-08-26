import './images.css';
import { Box, CircularProgress, Container, Dialog, DialogContent, ImageList, useMediaQuery, useTheme } from '@mui/material'
import { AddCircleOutline as AddCircleOutlineIcon, CheckCircleOutline } from '@mui/icons-material';
import { useGetImagesQuery, useUploadImagesMutation } from '../../features/images/imagesApiSlice'
import { useEffect, useRef, useState } from 'react';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import useTitle from '../../hooks/useTitle';
import ImageItem from '../../components/image-item/ImageItem';

const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif', 'svg'],
    sizeLimit = 5_242_880; //5MB
const defaultSize = 8;

export default function Images() {
    useTitle(`Kho ảnh - TAM PRODUCTION`);
    const theme = useTheme();
    const phoneBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
    const [pagination, setPagination] = useState({
        currPage: 1,
        pageSize: defaultSize,
        numberOfPages: 0,
        totalElements: 0
    });
    const { data: images, isLoading, isError, isSuccess } = useGetImagesQuery({
        page: pagination.currPage,
        size: pagination.pageSize
    });
    const [uploadImages, { isLoading: uploading }] = useUploadImagesMutation();
    const [files, setFiles] = useState([]);
    const [errMsg, setErrMsg] = useState("");
    const inputFile = useRef(null);
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState("");

    useEffect(() => {
        if (!isLoading && isSuccess && images) {
            setPagination({ ...pagination, 
                numberOfPages: images?.info?.numberOfPages,
                totalElements: images?.info?.totalElements
            })   
        }
    }, [isSuccess])

    useEffect(() => {
        return () => files.forEach(file => URL.revokeObjectURL(file.preview)); //prevent memory leaks
    }, []);

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) {
            if (pagination.currPage < pagination.numberOfPages) {
                setPagination({ ...pagination, currPage: pagination.currPage + 1 });
            }
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

    const preview = files?.map((image) => {
        return (<ImageItem
            preview={true}
            key={image.preview}
            image={image}
            uploading={uploading}
            enlargeImage={enlargeImage}
            handleRemoveImage={handleRemoveImage} />)
    })

    let content;
    if (isLoading) {
        content = [...new Array(8)].map((element, index) => {
            return (<ImageItem key={index} />)
        })
    } else if (isSuccess) {
        const { ids, entities } = images;

        content = ids?.length
            ? ids?.map(imageId => {
                const image = entities[imageId];

                return (<ImageItem
                    key={image.url}
                    image={image}
                    queryParams={{
                        page: pagination.currPage,
                        size: pagination.pageSize
                    }}
                    enlargeImage={enlargeImage} />)
            })
            : (preview.length === 0 ?
                <p>Không có hình ảnh nào</p>
                : null
            )
    } else if (isError) {
        content = <p>Đã xảy ra lỗi khi tải ảnh!</p>
    }

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
                <Box sx={{ 
                    width: 'auto', 
                    height: 900, 
                    overflowY: 'scroll',
                    border: '0.5px solid lightblue',
                    padding: '0 10px'
                }} 
                onScroll={handleScroll}>
                    <ImageList variant="masonry" cols={phoneBreakpoint ? 1 : 2} gap={6}>
                        {preview}
                        {content}
                    </ImageList>
                </Box>
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
                <DialogContent sx={{ display: 'flex', alignItems: 'center' }}>
                    {image ?
                        <img className="imageEnlarge"
                            alt={`${image.name}-enlarged`}
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
