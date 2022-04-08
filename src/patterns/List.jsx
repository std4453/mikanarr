import React from "react";
import { Datagrid, List, Pagination, TextField, TextInput } from "react-admin";

const patternFilters = [<TextInput label="Search" source="q" alwaysOn />];

const PatternPagination = (props) => (
  <Pagination rowsPerPageOptions={[30, 50, 100]} {...props} />
);

const PatternList = (props) => (
  <List
    sort={{
      field: "id",
      order: "DESC",
    }}
    filters={patternFilters}
    {...props}
    pagination={<PatternPagination />}
    perPage={30}
  >
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="series" />
      <TextField source="season" />
      <TextField source="language" />
      <TextField source="quality" />
    </Datagrid>
  </List>
);

export default PatternList;
