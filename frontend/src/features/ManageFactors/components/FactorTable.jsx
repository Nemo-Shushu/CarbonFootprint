import PropTypes from "prop-types";

FactorTable.propTypes = {
  conversionFactors: PropTypes.array,
  showDelete: PropTypes.func,
  handleShowEdit: PropTypes.func,
};

function FactorTable({ conversionFactors, showDelete, handleShowEdit }) {
  return (
    <table className="table table-hover table-striped">
      <thead>
        <tr className="align-middle text-start">
          <th scope="col" style={{ width: "60%" }}>
            Activity
          </th>
          <th scope="col" style={{ width: "30%" }}>
            kg CO2e
          </th>
          <th scope="col" style={{ width: "10%" }} />
        </tr>
      </thead>
      <tbody className="table-group-divider">
        {conversionFactors.map((factor) => (
          <tr className="align-middle text-start" key={factor.id}>
            <td>{factor.activity}</td>
            <td>{factor.value}</td>
            <td>
              <a
                className="edit-icon me-5"
                onClick={() =>
                  handleShowEdit(factor.id, factor.activity, factor.value)
                }
              >
                <i
                  className="bi bi-pen-fill mt-2 mb-3"
                  style={{ fontSize: "20px" }}
                />
              </a>
              <a
                className="delete-icon me-5 text-danger"
                onClick={() => showDelete(factor.id)}
              >
                <i className="bi bi-trash3-fill" style={{ fontSize: "20px" }} />
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default FactorTable;
