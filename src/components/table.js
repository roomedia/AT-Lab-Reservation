/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import cellEditFactory from 'react-bootstrap-table2-editor'
import paginationFactory, { PaginationProvider, SizePerPageDropdownStandalone, PaginationListStandalone } from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit'
import { getTable, updateTable, } from '../db/db'
import { Title } from '../components'

function TableFunction({ paginationProps, tableProps, strings }) {
  const { SearchBar } = Search
  const { exportCSV } = strings
  const { ExportCSVButton } = CSVExport

  return (
    <div className="table-function">
      <div>
        <SizePerPageDropdownStandalone { ...paginationProps } />
        <PaginationListStandalone {...paginationProps} />
      </div>

      <div>
        <SearchBar {...tableProps.searchProps } />
        <ExportCSVButton
          className="btn-secondary"
          {...tableProps.csvProps}
        >
          {exportCSV}
        </ExportCSVButton>
      </div>
    </div>
  )
}

function contentTable({ paginationProps, paginationTableProps, strings, state, cellEdit }) {
  const {
    title,
    columns,
    limit,
    data,
    keyFieldIndex,
  } = state

  return (
    <ToolkitProvider
      keyField={columns[keyFieldIndex].dataField}
      data={data.slice(0, limit)}
      columns={columns}
      exportCSV={{
        fileName: title + " " + Date() + ".csv",
        blobType: 'text/csv;charset=ansi',
      }}
      search
    >
    {
      props => (
        <Col md={{ size: 10, offset: 1 }}>
          <TableFunction
            paginationProps={paginationProps}
            tableProps={props}
            strings={strings}
          />
          <BootstrapTable
            { ...paginationTableProps }
            { ...props.baseProps }
            cellEdit={cellEdit}
            condensed
            striped
            hover
          />
          <TableFunction
            paginationProps={paginationProps}
            tableProps={props}
            strings={strings}
          />
        </Col>
      )
    }
    </ToolkitProvider>
  )
}

class ListTable extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    strings: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
  }

  static defaultProps = {
    options: {
      custom: true,
    }
  }

  state = {
    title: "",
    columns: [],
    data: [],
    keyFieldIndex: 0,
  }

  handler = (state) => {
    this.setState({
      ...this.state,
      ...state,
    })
  }

  makeInitialState(type, columnFields, keyFieldIndex=0) {
    const {
      strings,
    } = this.props

    return {
      ...this.state,
      title: strings[type],
      columns: columnFields.map(({ field, width }) => ({
        dataField: field,
        text: strings[field],
        style: {
          width: width,
        },
        sort: true,
      })),
      keyFieldIndex: keyFieldIndex,
    }
  }

  makeCellEditFactory(type) {
    return cellEditFactory({
      mode: 'click',
      autoSelectText: true,
      afterSaveCell: (oldValue, newValue, row, col) => {
        updateTable(type, newValue, row, col)
      }
    })
  }

  render(feedback=null) {
    const {
      type,
      options,
    } = this.props

    const {
      title,
    } = this.state
    
    return (
      <Row md={1} className="mb-5">
        <Title title={title} span={feedback}/>
        <PaginationProvider pagination={paginationFactory(options)}>
          { (props) => contentTable({
              ...props,
              strings: this.props.strings,
              state: this.state,
              cellEdit: this.makeCellEditFactory(type),
            })
          }
        </PaginationProvider>
      </Row>
    )
  }
}

class UserTable extends ListTable {
  static defaultProps = {
    ...super.defaultProps,
    type: this.name.replace('Table', '').toLowerCase(),
  }

  constructor(props) {
    super(props)
    const {
      type,
    } = props

    this.state = this.makeInitialState(
      type,
      [
        {
          field: 'id',
          width: "7%",
        },
        {
          field: 'studentID',
          width: "31%",
        },
        {
          field: 'name',
          width: "31%",
        },
        {
          field: 'count',
          width: "31%",
        },
      ],
      1
    )
    getTable(type, this.handler)
  }
}

class LogTable extends ListTable {
  static defaultProps = {
    ...super.defaultProps,
    type: this.name.replace('Table', '').toLowerCase(),
  }

  constructor(props) {
    super(props)
    const {
      type,
    } = props

    this.state = this.makeInitialState(
      type,
      [
        {
          field: 'id',
          width: '7%',
        },
        {
          field: 'created',
          width: '21%',
        },
        {
          field: 'tableName',
          width: '10%',
        },
        {
          field: 'action',
          width: '10%',
        },
        {
          field: 'log',
          width: 0,
        },
      ],
    )
    this.makeCellEditFactory = ()=>({})
    getTable(type, this.handler)
  }
}

class ReservationTable extends ListTable {
  static defaultProps = {
    ...super.defaultProps,
    type: this.name.replace('Table', '').toLowerCase(),
  }

  constructor(props) {
    super(props)
    const {
      type,
    } = props

    this.state = this.makeInitialState(
      type,
      [
        {
          field: 'id',
          width: '7%',
        },
        {
          field: 'studentID',
          width: '20%',
        },
        {
          field: 'roomNum',
          width: '13%',
        },
        {
          field: 'seatNum',
          width: '13%',
        },
        {
          field: 'startTime',
          width: '24%',
        },
        {
          field: 'endTime',
          width: 0,
        },
      ],
    )
    getTable(type, this.handler)
  }

  render() {
    const {
      passwordReset,
    } = this.props.strings

    return super.render(passwordReset)
  }
}

export { UserTable, LogTable, ReservationTable }