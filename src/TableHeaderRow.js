import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import HeaderSortArrow from './HeaderSortArrow';
import TableRow from './TableRow';
import { SortDirection } from './constants';
import { pipe } from './utils';


class TableHeaderRow extends React.Component {
  get columns() {
    return this.props.columns.map(column => {
      if (column.sortBy) {
        column.onCellClick = pipe(column.onCellClick, () => this.props.handleHeaderSortClick(column.sortBy));
      }

      if (column.sortBy === this.props.sortingCriteria) {
        column.icons = [<HeaderSortArrow sortDirection={this.props.sortDirection} />];
      }

      return column;
    });
  }

  get headerSpaceStyle() {
    return {
      // 1px border top
      // 1px border bottom
      height: this.props.headerHeight + 2,
    };
  }

  render() {
    return [
      <TableRow
        key="Table__Table__Row--header"
        className={classNames(
          "Tangelo__TableRow--header",
          this.props.className
        )}
        columns={this.columns}
        rowHeight={this.props.headerHeight}
        rowIndex={-1}
      />,

      <div
        key="header-space"
        style={this.headerSpaceStyle}
      />,
    ];
  }
};

TableHeaderRow.propTypes = {
  /**
   *
   */
  className: PropTypes.string.isRequired,

  /**
   *
   * TODO create types for columns
   */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      align: PropTypes.oneOf([
        'left',
        'right',
        'center',
      ]),
      columnClassName: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
      ]),
      cellRenderer: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
      ]),
      flexStyle: PropTypes.oneOfType([
        PropTypes.shape({
          flexBasis: PropTypes.string,
        }),
        PropTypes.shape({
          flex: PropTypes.string,
        }),
      ]),
      onCellClick: PropTypes.func,
      onCellDoubleClick: PropTypes.func,
      onCellMouseOut: PropTypes.func,
      onCellMouseOver: PropTypes.func,
      onCellRightClick: PropTypes.func,
    })
  ).isRequired,

  /**
   *
   */
  handleHeaderSortClick: PropTypes.func.isRequired,

  /**
   *
   */
  headerHeight: PropTypes.number.isRequired,

  /**
   *
   */
  sortDirection: PropTypes.oneOf([
    SortDirection.ASC,
    SortDirection.DESC,
  ]),

  /**
   *
   */
  sortingCriteria: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
};

TableHeaderRow.defaultProps = {
  sortDirection: null,
  sortingCriteria: null,
};

TableHeaderRow.displayName = 'TangeloTableHeaderRow';


export default TableHeaderRow;
