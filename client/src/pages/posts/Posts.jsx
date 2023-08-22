import './posts.css';
import BreadCrumbs from '../../components/breadcrumbs/BreadCrumbs';
import { Autocomplete, Chip, Container, TextField, Grid, MenuItem, Box } from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetPostsQuery } from '../../features/posts/postsApiSlice';
import { useEffect, useRef, useState } from 'react';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice';
import useTitle from '../../hooks/useTitle';
import CustomPagination from '../../components/custom-pagination/CustomPagination';
import styled from '@emotion/styled';
import PostTab from '../../components/post-tab/PostTab';
import useAuth from '../../hooks/useAuth';

const CustomInput = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        borderRadius: 0,
        backgroundColor: 'white',
        color: 'black',
    },
    '& label.Mui-focused': {
        color: '#b4a0a8'
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#B2BAC2',
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 0,
        '& fieldset': {
            borderRadius: 0,
            borderColor: '#E0E3E7',
        },
        '&:hover fieldset': {
            borderRadius: 0,
            borderColor: '#B2BAC2',
        },
        '&.Mui-focused fieldset': {
            borderRadius: 0,
            borderColor: '#6F7E8C',
        },
    },
    '& input:valid + fieldset': {
        borderColor: 'lightgray',
        borderRadius: 0,
        borderWidth: 1,
    },
    '& input:invalid + fieldset': {
        borderColor: '#f25a5a',
        borderRadius: 0,
        borderWidth: 1,
    },
    '& input:valid:focus + fieldset': {
        borderColor: '#0f3e3c',
        borderLeftWidth: 4,
        borderRadius: 0,
        padding: '4px !important',
    },
}));

const defaultSize = 8;
export default function Search() {
    const { id, isAdmin } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const { data: categories, isLoading: loadingCates, isSuccess: catesDone, isError: catesError } = useGetCategoriesQuery();
    const [pagination, setPagination] = useState({
        currPage: searchParams.get("page") || 1,
        pageSize: searchParams.get("size") || defaultSize,
        numberOfPages: 0,
    });
    const [filters, setFilters] = useState({
        tags: searchParams.get("tags") ? searchParams.get("tags").split(',') : [],
        author: searchParams.get("author") || "",
        cate: searchParams.get("cate") || undefined,
    })
    const { data: posts, isLoading, isSuccess, isError } = useGetPostsQuery({
        tags: filters.tags.length !== 0 ? filters.tags : undefined,
        author: filters.author ? filters.author : undefined,
        cate: filters.cate,
        page: pagination.currPage,
        size: pagination.pageSize
    }, {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });
    const authorRef = useRef(null);
    useTitle(`Quản lý bài viết - TAM PRODUCTION`);

    useEffect(() => {
        if (!isLoading && isSuccess && posts) {
            setPagination({ ...pagination, numberOfPages: posts?.info?.numberOfPages });
        }
    }, [isSuccess])

    //#region handle
    const handlePageChange = (page) => {
        if (page === 1) {
            searchParams.delete("page");
            setSearchParams(searchParams);
        } else {
            searchParams.set("page", page);
            setSearchParams(searchParams);
        }
        setPagination({ ...pagination, currPage: page });
    }

    const handleChangeSize = (newValue) => {
        handlePageChange(1);
        if (newValue === defaultSize) {
            searchParams.delete("size");
            setSearchParams(searchParams);
        } else {
            searchParams.set("size", newValue);
            setSearchParams(searchParams);
        }
        setPagination({ ...pagination, pageSize: newValue });
    }

    const handleChangeTags = (event, value) => {
        handlePageChange(1);

        if (value.length === 0) {
            searchParams.delete("tags");
            setSearchParams(searchParams);
        } else {
            searchParams.set("tags", value);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, tags: value });
    }

    const handleChangeAuthor = (event) => {
        event.preventDefault();
        handlePageChange(1);

        const newAuthor = authorRef.current.value;

        if (newAuthor === "") {
            searchParams.delete("author");
            setSearchParams(searchParams);
        } else {
            searchParams.set("author", newAuthor);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, author: newAuthor });
    }

    const handleChangeCate = (event) => {
        handlePageChange(1);

        const newCate = event.target.value;

        if (newCate === undefined) {
            searchParams.delete("cate");
            setSearchParams(searchParams);
        } else {
            searchParams.set("cate", newCate);
            setSearchParams(searchParams);
        }
        setFilters({ ...filters, cate: newCate });
    }
    //#endregion

    let catesList;

    if (loadingCates) {
        catesList = <MenuItem disabled value="">Đang tải...</MenuItem>
    } else if (catesDone) {
        const { ids, entities } = categories;

        catesList = ids?.length
            ? ids?.map(cateId => {
                const cate = entities[cateId];

                return (
                    <MenuItem key={cateId} value={cateId}>
                        {cate.name}
                    </MenuItem>
                )
            })
            : <MenuItem disabled value="">Danh mục trống</MenuItem>
    } else if (catesError) {
        catesList = <MenuItem disabled value="">Lỗi danh mục</MenuItem>
    }

    let content;

    if (isLoading) {
        content = [...new Array(pagination.pageSize)].map((element, index) => {
            return (<PostTab key={index} />)
        })
    } else if (isSuccess) {
        const { ids, entities } = posts;

        let filteredPosts = ids?.map(postId => {
            const post = entities[postId];
            if (isAdmin || post?.user === id) return post;
        });

        content = filteredPosts?.length
            ? filteredPosts?.map(post => {
                return (<PostTab key={post?.id} post={post} />)
            })
            : <p>Không có bài viết nào</p>
    } else if (isError) {
        content = <p>Đã có lỗi xảy ra khi tải bài viết!</p>
    }

    return (
        <div className="postsContainer">
            <Container fluid maxWidth="lg">
                <BreadCrumbs route={'Quản lý bài viết'} />
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <h1 className="alternativeTitle">QUẢN LÝ BÀI VIẾT</h1>
                    <Link to="/new-post" className="addButton">
                        <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
                        Thêm bài viết
                    </Link>
                </Box>
                <Grid container spacing={1}>
                    <Grid item xs={12} lg={6}>
                        <Autocomplete
                            multiple
                            freeSolo
                            value={filters?.tags}
                            options={[]}
                            onChange={handleChangeTags}
                            renderTags={(tags, getTagProps) =>
                                tags.map((option, index) => (
                                    <Chip key={index} label={option} {...getTagProps({ index })} />
                                ))
                            }
                            renderInput={params => (
                                <CustomInput
                                    {...params}
                                    variant="outlined"
                                    label="Từ khoá"
                                    placeholder="Tìm từ khoá"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <form onSubmit={handleChangeAuthor}>
                            <CustomInput
                                defaultValue={filters?.author}
                                inputRef={authorRef}
                                onBlur={handleChangeAuthor}
                                fullWidth
                                id="author"
                                label="Tác giả"
                            />
                        </form>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <CustomInput
                            required
                            label="Danh mục"
                            select
                            fullWidth
                            id="category"
                            value={filters?.cate}
                            onChange={handleChangeCate}
                        >
                            <MenuItem value={undefined}>Tất cả</MenuItem>
                            {catesList}
                        </CustomInput>
                    </Grid>
                </Grid>
                {content}
                <CustomPagination pagination={pagination}
                    onPageChange={handlePageChange}
                    onSizeChange={handleChangeSize} />
            </Container>
        </div>
    )
}
