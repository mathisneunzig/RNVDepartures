import { Fragment } from "react"
import DepartureRowMain from "./DepartureRowMain"
import DepartureRowDetails from "./DepartureRowDetails"
import { DepartureRowProps } from "./types"

export default function DepartureRow(props: DepartureRowProps) {
  return (
    <Fragment>
      <DepartureRowMain {...props} />
      <DepartureRowDetails {...props} />
    </Fragment>
  )
}
