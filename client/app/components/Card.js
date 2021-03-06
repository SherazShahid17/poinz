import React from 'react';
import Immutable from 'immutable';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import {giveStoryEstimate} from '../actions';

/**
 * One estimation card on the board.
 */
const Card = ({card, selectedStoryId, ownEstimate, estimationWaiting, giveStoryEstimate}) => {

  const cardClasses = classnames('card clickable', {
    'card-selected': card.get('value') === ownEstimate
  });
  const cardInnerClasses = classnames('card-inner', {
    'waiting': card.get('value') === estimationWaiting
  });

  const customCardStyle = card.get('color') ? {background: card.get('color'), color: 'white'} : {};
  return (
    <button className={cardClasses} onClick={() => giveStoryEstimate(selectedStoryId, card.get('value'))}>
      <div className={cardInnerClasses} style={customCardStyle}>{card.get('label')}</div>
    </button>
  );
};

Card.propTypes = {
  card: PropTypes.instanceOf(Immutable.Map),
  selectedStoryId: PropTypes.string,
  ownEstimate: PropTypes.number,
  estimationWaiting: PropTypes.number,
  giveStoryEstimate: PropTypes.func
};

export default connect(
  state => {
    const pendingEstimationCommand = state.get('pendingCommands').find(cmd => cmd.name === 'giveStoryEstimate');
    return {
      selectedStoryId: state.get('selectedStory'),
      ownEstimate: state.getIn(['stories', state.get('selectedStory'), 'estimations', state.get('userId')]),
      estimationWaiting: pendingEstimationCommand ? pendingEstimationCommand.payload.value : undefined
    };
  },
  dispatch => bindActionCreators({giveStoryEstimate}, dispatch)
)(Card);
