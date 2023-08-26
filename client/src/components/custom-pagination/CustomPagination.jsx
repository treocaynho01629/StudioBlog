import './custom-pagination.css';
import { PaginationItem, Stack, TextField, MenuItem, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

const StyledPageItem = styled(PaginationItem)(({ theme }) => ({
    borderRadius: 0,
    backgroundColor: 'lightgray',

    '&:hover': {
        backgroundColor: '#0f3e3c',
        color:'white',
    },

    '&:focus': {
        outline: 'none',
        border: 'none'
    },

    '&.Mui-disabled': {
        display: 'none',
    },

    '&.MuiPaginationItem-ellipsis': {
        backgroundColor: 'transparent',
        fontWeight: 'bold',
    },

    '&.Mui-selected': {
        backgroundColor: '#0f3e3c',
        color:'white',
    },
}));

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

export default function CustomPagination(props) {
    const { pagination, onPageChange, onSizeChange, onPrefetch } = props;
    const [page, setPage] = useState(pagination.currPage);
    const [count, setCount] = useState(pagination.numberOfPages);

    const handlePrefetch = (event, page) => {
        const prefetchPage = Number(event.target.textContent);
        if (prefetchPage && onPrefetch) {
            onPrefetch(prefetchPage);
        }
    }

    const handlePageChange = (event, page) => {
        if (onPageChange) {
            onPageChange(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const handleChangeSize = (event) => {
        if (onSizeChange) {
            onSizeChange(event.target.value);
        }
    }

    useEffect(() => {
        setPage(pagination?.currPage);
        setCount(pagination?.numberOfPages);
    }, [pagination])

    return (
        <div className="paginationContainer">
            <Stack spacing={2} sx={{ my: 5 }}>
                <Pagination count={count ? count : 0} shape="rounded"
                    page={page}
                    onChange={handlePageChange}
                    renderItem={(item) => (
                        <StyledPageItem
                            onMouseEnter={handlePrefetch}
                            {...item}
                        />
                    )} />
            </Stack>
            <CustomInput
                select
                size="small"
                value={pagination.pageSize}
                onChange={handleChangeSize}
            >
                <MenuItem value={8}>Hiển thị 8</MenuItem>
                <MenuItem value={16}>Hiển thị 16</MenuItem>
                <MenuItem value={24}>Hiển thị 24</MenuItem>
                <MenuItem value={48}>Hiển thị 48</MenuItem>
            </CustomInput>
        </div>
    )
}
