import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TableCell from './TableCell';
import {
  getEventHandlerProps,
  getIsClickable,
  pickProps,
} from './utils';


// TODO possibly convert this to a function like react-virtualized-table
class TableRow extends React.Component {
  constructor(...args) {
    super(...args);

    // <number: columnIndex, Element: <TableCell />>
    this._cellCache = {};

    this.state = {
      // If a child cell is highlighted, we shouldn't highlight the row
      isChildCellHighlighted: false,
    };

    this.handleChildCellMouseOver = this.handleChildCellMouseOver.bind(this);
    this.handleChildCellMouseOut = this.handleChildCellMouseOut.bind(this);
  }

  componentWillMount() {
    this._constructCells(this.props);
  }

  componentWillUpdate(nextProps) {
    // TODO consider only updating some cells like we do for rows in `TableBody`
    this._constructCells(nextProps);
  }

  get rowStyle() {
    const {
      rowHeight,
    } = this.props;

    return {
      height: rowHeight,
      lineHeight: `${rowHeight}px`
    }
  }

  handleChildCellMouseOver() {
    this.setState({ isChildCellHighlighted: true });
  }

  handleChildCellMouseOut() {
    this.setState({ isChildCellHighlighted: false });
  }

  _constructCells(props) {
    const {
      columns,
      rowIndex,
    } = props;

    // TODO optimize so we only render cells that are in view
    columns.forEach((column, columnIndex) => {
      const className = 
        typeof column.columnClassName === 'function' ?
        column.columnClassName({ columnIndex, rowIndex }) :
        column.columnClassName;

      const cellContent =
        typeof column.cellRenderer === 'function' ?
        column.cellRenderer({ columnIndex, rowIndex }) :
        column.cellRenderer;

      const icons =
        typeof column.icons === 'function' ?
         column.icons({ columnIndex, rowIndex }) :
         column.icons;

      const tooltip =
        typeof column.tooltip === 'function' ?
          column.tooltip({ columnIndex, rowIndex }) :
          column.tooltip;

      this._cellCache[columnIndex] = (
        <TableCell
          {...pickProps(column, [
            'align',
            'flexStyle',
            'hideRightBorder',
          ])}
          key={`table_cell_${rowIndex}_${columnIndex}`}
          className={className}
          columnIndex={columnIndex}
          handleChildCellMouseOver={this.handleChildCellMouseOver}
          handleChildCellMouseOut={this.handleChildCellMouseOut}
          icons={icons}
          onClick={column.onCellClick}
          onDoubleClick={column.onCellDoubleClick}
          onMouseOut={column.onCellMouseOut}
          onMouseOver={column.onCellMouseOver}
          onRightClick={column.onCellRightClick}
          rowIndex={rowIndex}
          tooltip={tooltip}
        >
          {cellContent}
        </TableCell>
      );
    });
  }

  render() {
    const {
      rowIndex,
    } = this.props;

    return (
      <div
        className={classNames(
          "Tangelo__TableRow",
          this.props.className,
          {
            'Tangelo__TableRow--highlight-disabled': this.state.isChildCellHighlighted,
            'Tangelo__TableRow--clickable': getIsClickable(this),
            'Tangelo__TableRow--hide-border-bottom': this.props.hideBorderBottom,
          }
        )}
        style={this.rowStyle}
        {...getEventHandlerProps(this, { rowIndex })}
      >
        {Object.values(this._cellCache)}
      </div>
    );
  }
};

TableRow.propTypes = {
  /**
   *
   */
  className: PropTypes.string,

  /**
   *
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
      ]).isRequired,
      icons: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.func,
      ]),
    })
  ).isRequired,

  /**
   *
   */
  hideBorderBottom: PropTypes.bool,

  /**
   *
   */
  onClick: PropTypes.func,

  /**
   *
   */
  onDoubleClick: PropTypes.func,

  /**
   *
   */
  onMouseOut: PropTypes.func,

  /**
   *
   */
  onMouseOver: PropTypes.func,

  /**
   *
   */
  onRightClick: PropTypes.func,

  /**
   *
   */
  rowHeight: PropTypes.number.isRequired,

  /**
   *
   */
  rowIndex: PropTypes.number.isRequired,
};

TableRow.defaultProps = {
  className: '',
  hideBorderBottom: false,
  onClick: null,
  onDoubleClick: null,
  onMouseOut: null,
  onMouseOver: null,
  onRightClick: null,
  selected: false,
};

TableRow.displayName = 'TangeloTableRow';


export default TableRow;
