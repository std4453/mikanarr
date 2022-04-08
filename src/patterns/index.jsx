import React from "react";
import { Resource } from "react-admin";
import { PatternCreate, PatternEdit } from "./Edit";
import PatternList from "./List";

const patternResource = (
  <Resource
    name="patterns"
    list={PatternList}
    edit={PatternEdit}
    create={PatternCreate}
  />
);

export default patternResource;
