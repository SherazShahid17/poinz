import React from 'react';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Anchorify from 'react-anchorify-text';

import { newEstimationRound, reveal } from '../services/actions';

import Cards from './Cards';

/**
 * Displays
 * - the currently selected story
 * - a list of available cards if the user can currently give estimations.
 * - action buttons ("reveal manually" and "new round")
 *
 */
const Estimation = ({ selectedStory, user, newEstimationRound, reveal }) => {

  const ownEstimate = selectedStory.getIn(['estimations', user.get('id')]);

  const revealed = selectedStory.get('revealed');
  const isVisitor = user.get('visitor');

  const userCanCurrentlyEstimate = !isVisitor;
  return (
    <div className='estimation'>

      <div className='selected-story'>
        <h4>
          {selectedStory.get('title')}
        </h4>
        <div>
          <Anchorify text={selectedStory.get('description')}/>
        </div>
      </div>

      {
        userCanCurrentlyEstimate &&
        <Cards ownEstimate={ownEstimate}/>
      }

      {
        userCanCurrentlyEstimate &&
        <div className='board-actions'>
          <button type='button' className='pure-button pure-button-primary'
                  onClick={() => reveal(selectedStory.get('id'))}>
            Reveal manually
            <i className='fa fa-hand-paper-o button-icon-right'></i>
          </button>
        </div>
      }

      {
        revealed &&
        <div className='board-actions'>
          <button type='button' className='pure-button pure-button-primary'
                  onClick={() => newEstimationRound(selectedStory.get('id'))}>
            New Round
            <i className='fa fa-undo  button-icon-right'></i>
          </button>
        </div>
      }

    </div>
  );
};

Estimation.propTypes = {
  selectedStory: React.PropTypes.instanceOf(Immutable.Map),
  user: React.PropTypes.instanceOf(Immutable.Map),
  newEstimationRound: React.PropTypes.func,
  reveal: React.PropTypes.func
};

export default connect(
  state => ({
    selectedStory: state.getIn(['stories', state.get('selectedStory')]),
    user: state.getIn(['users', state.get('userId')])
  }),
  dispatch => bindActionCreators({newEstimationRound, reveal}, dispatch)
)(Estimation);
