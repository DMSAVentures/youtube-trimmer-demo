import React, {useState} from "react";

export interface IPaginationProps {
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    currentPage: number;
}
// Disclaimer: I didn't write this component from scratch. I copied it from my design system and made minimal changes to make it work with the assignment.
// You can find it at https://github.com/DMSAVentures/webapp/tree/main/src/components/simpleui/pagination
export const Pagination: React.FC<IPaginationProps> = (props) => {
    const {
        totalItems,
        itemsPerPage,
        onPageChange,
        currentPage,
    } = props;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const [pageWindow, setPageWindow] = useState(1);
    const pagesToShow = 4; // Number of pages to display in the pagination control
    const maxPageWindow = Math.ceil(totalPages / pagesToShow);

    const getPageNumbers = () => {
        const start = (pageWindow - 1) * pagesToShow + 1;
        const end = Math.min(start + pagesToShow - 1, totalPages);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const handleNextPageRange = () => {
        if (pageWindow < maxPageWindow) {
            setPageWindow(pageWindow + 1);
        }
    };

    const handlePreviousPageRange = () => {
        if (pageWindow > 1) {
            setPageWindow(pageWindow - 1);
        }
    };

    const handleToFirst = () => {
        onPageChange(1);
        setPageWindow(1);
    }

    const handleToLast = () => {
        onPageChange(totalPages);
        setPageWindow(maxPageWindow);
    }

    return (
        <div className={'w-full space-x-2 justify-center flex items-center'}>
            {/* First Page Button */}
            <button className="p-2 text-gray-800 bg-white rounded-lg cursor-pointer hover:bg-gray-50 disabled:bg-gray-50 disabled:cursor-not-allowed" disabled={pageWindow === 1} onClick={handleToFirst} title="First Page">
                &lt;
            </button>


            {/* Previous Page Range Button */}
            <button
                className="p-2 text-gray-800 bg-white rounded-lg cursor-pointer hover:bg-gray-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                onClick={handlePreviousPageRange}
                disabled={pageWindow === 1}
                title="Previous Page Range"
            >
                &#10913;
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    className={`p-2 text-gray-800 bg-white rounded-lg cursor-pointer hover:bg-gray-50 ${currentPage === page ? 'border-2 border-blue-600 border-solid' : ''}`}
                    onClick={() => onPageChange(page)}
                >
                    <span className={`pagination__pagenumber`}>{page}</span>
                </button>
            ))}
            {/* Ellipsis for Next Page Range */}
            {pageWindow < maxPageWindow && (
                <button className="p-2 text-gray-800 bg-white rounded-lg cursor-pointer hover:bg-gray-50" onClick={handleNextPageRange} title="Next Page Range">
                    <span className={`pagination__pagenumber`}>...</span>
                </button>
            )}

            {/* Next Page Range Button */}
            <button
                className="p-2 text-gray-800 bg-white rounded-lg cursor-pointer hover:bg-gray-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                onClick={handleNextPageRange}
                disabled={pageWindow === maxPageWindow}
                title="Next Page Range"
            >
                &#x2A20;
            </button>

            {/* Last Page Button */}
            <button className="p-2 text-gray-800 bg-white rounded-lg cursor-pointer hover:bg-gray-50 disabled:bg-gray-50 disabled:cursor-not-allowed" disabled={pageWindow === maxPageWindow} onClick={handleToLast} title="Last Page">
                &gt;
            </button>
        </div>
    );
};
