import cn from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import * as styles from './Groups.module.scss';
import getBlockStyles from '@/functions/wordpress/blocks/getBlockStyles';

/**
 * Render the Group component.
 *
 * @param  {object}  props                   Container component props.
 * @param  {string}  props.id                Optional ID/Anchor.
 * @param  {string}  props.className         Optional className.
 * @param  {string}  props.groupsCount       Total number of Group.
 * @param  {object}  props.children          React children.
 * @param  {object}  props.style             Custom Group styles.
 * @param  {string}  props.verticalAlignment Vertical alignment of Group.
 * @param  {boolean} props.isStackedOnMobile Checks if the Group are stacked.
 * @return {Element}                         The Group component.
 */

export default function Groups({
  id,
  className,
  groupsCount,
  children,
  style,
  verticalAlignment,
  isStackedOnMobile,
}) {
  const groupStyles = getBlockStyles({ style });
  return (
    <>
      <div
        id={id || null}
        className={cn(
          styles.groups,
          isStackedOnMobile && styles.groupsStacked,
          groupsCount && styles[`columns-${groupsCount}`],
          className,
          verticalAlignment === 'center' ? styles.alignCenter : null,
          verticalAlignment === 'bottom' ? styles.alignBottom : null
        )}
        style={groupStyles}
      >
        {children}
      </div>
    </>
  );
}

Groups.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  groupsCount: PropTypes.number,
  children: PropTypes.node,
  // style: PropTypes.shape({
  //   background: PropTypes.string,
  //   backgroundColor: PropTypes.string,
  //   color: PropTypes.string
  // }),
  verticalAlignment: PropTypes.string,
};
Groups.defaultProps = {
  groupsCount: 3,
};
