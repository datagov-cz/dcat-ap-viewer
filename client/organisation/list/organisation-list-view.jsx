import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Row, Col, Container} from "reactstrap";
import {fetchDataRequest} from "./organisation-list-action";
import {formatNumber} from "../../services/formats";
import {
    getUrl,
    DATASET_LIST_URL,
    PUBLISHER_QUERY
} from "../../application/navigation";

const OrganisationListItem = ({value}) => {
    let datasetCountLabel;
    if (value.count === 1) {
        datasetCountLabel = "1 datová sada";
    } else if (value.count <= 4) {
        datasetCountLabel = value.count + " datové sady";
    } else {
        datasetCountLabel = formatNumber(value.count) + " datových sad";
    }
    return (
        <div>
            <Link
                to={getUrl(DATASET_LIST_URL, {[PUBLISHER_QUERY]: value.label})}>
                <h4>{value.label}</h4>
            </Link>
            <p>
                {datasetCountLabel}
            </p>
            <hr/>
        </div>
    );
};

const OrganisationList = ({values}) => {
    return (
        <div>
            <hr/>
            {values.map((item) => (
                <OrganisationListItem key={item.label} value={item}/>
            ))}
        </div>
    )
};

class OrganisationListViewComponent extends React.Component {

    componentDidMount() {
        this.props.fetchData(this.props.query);
    }

    componentWillReceiveProps(nextProps) {
        // Check whether we need to update data.
        if (nextProps.query !== this.props.query) {
            this.props.fetchData(nextProps.query);
        }
    }

    render() {
        const props = this.props;
        // TODO Extract "organisations.length", update label
        return (
            <Container>
                <Row>
                    <Col>
                        <div style={{"margin": "1em 1em 1em 1em"}}>
                            <h4>
                                {formatNumber(props.organisations.length)}
                                poskytovatelů nalezeno
                            </h4>
                            <OrganisationList values={props.organisations}/>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    "organisations": state.organisation.list.data.organisations
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "fetchData": (query) => {
        dispatch(fetchDataRequest(query));
    }
});

export const OrganisationListView = connect(
    mapStateToProps,
    mapDispatchToProps
)(OrganisationListViewComponent);
