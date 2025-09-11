import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight
} from 'react-icons/fa';
import { 
  FlexBox,
  Container
} from '../../components';
import { PagedResponse } from '../../types';

interface SearchPaginationProps {
  page: PagedResponse<any>;
  height?: string;
  width?: string;
  loadPage: (pageIndex: number, pageSize: number) => void;
}

const SearchPagination: React.FC<SearchPaginationProps> = ({ page, height, width, loadPage }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(page.number);
  
  const pageSize = page.size;
  const lastPageNumber = page.totalPages;
  const isLastPage = currentPageIndex === lastPageNumber - 1;
  const isFirstPage = currentPageIndex === 0;

  useEffect(() => {
    setCurrentPageIndex(page.number);
  }, [page.number]);

  return (
    <Container 
      height={height} 
      width={width}
      backgroundColor='transparent'  
    >
      <FlexBox>
        <FlexBox.Item alignCenter>
          <PaginationControls>
            <ControlItem onClick={() => goToFirstPage(loadPage)} disabled={isFirstPage}>
              <FaAngleDoubleLeft />
            </ControlItem>
            <ControlItem onClick={() => goToPreviousPage(loadPage)} disabled={isFirstPage}>
              <FaAngleLeft />
            </ControlItem>
            {currentPageIndex + 1} / {lastPageNumber}
            <ControlItem onClick={() => goToNextPage(loadPage)} disabled={isLastPage}>
              <FaAngleRight />
            </ControlItem>
            <ControlItem onClick={() => goToLastPage(loadPage)} disabled={isLastPage}>
              <FaAngleDoubleRight />
            </ControlItem>
          </PaginationControls>
        </FlexBox.Item>
      </FlexBox>
    </Container>
  );

  function goToFirstPage(loadPage: (pageIndex: number, pageSize: number) => void) {
    loadPage(0, pageSize);
  }

  function goToPreviousPage(loadPage: (pageIndex: number, pageSize: number) => void) {
    if (currentPageIndex > 0) {
      loadPage(currentPageIndex - 1, pageSize);
    }
  }

  function goToNextPage(loadPage: (pageIndex: number, pageSize: number) => void) {
    if (currentPageIndex < lastPageNumber - 1) {
      loadPage(currentPageIndex + 1, pageSize);
    }
  }

  function goToLastPage(loadPage: (pageIndex: number, pageSize: number) => void) {
    if (currentPageIndex < lastPageNumber - 1) {
      loadPage(lastPageNumber - 1, pageSize);
    }
  }
};

export default SearchPagination;

const PaginationControls = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.quaternary};
`;

interface ControlItemProps {
  disabled?: boolean;
}

const ControlItem = styled.li<ControlItemProps>`
  width: 35px;
  height: 100%;
  font-size: 20px;
  color: ${props => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? '0.2' : '1')};

  &:first-child {
    margin-left: 0;
  }

  &:hover {
    color: ${props => (props.disabled ? props.theme.colors.white : props.theme.colors.gray)};
  }
`;
