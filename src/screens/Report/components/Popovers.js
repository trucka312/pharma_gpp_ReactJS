import React, { Component } from 'react';

class CustomPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopoverOpen: false,
    };
  }

  togglePopover = () => {
    this.setState((prevState) => ({
      isPopoverOpen: !prevState.isPopoverOpen,
    }));
  };

  render() {
    const { children, buttonText, popoverWidth  } = this.props;
    const { isPopoverOpen } = this.state;

    return (
      <div style={{ position: 'relative' }}>
      <button
        onClick={this.togglePopover}  
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #ccc',
          borderRadius: '2px',
          width: popoverWidth,
          height: '40px',
          outline: 'none',
          padding: '0 5px',
          cursor: 'pointer',
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
        {buttonText || 'Default Text'}
        <i class="fas fa-sort-down"></i>
        </div>
      </button>
      {isPopoverOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            left: 0,
            minWidth: '200px',
            zIndex: 1,
          }}
        >
          {/* Mũi tên trỏ lên */}
          <svg
              style={{
                position: 'absolute',
                top: '-9px', 
                left: '23%',
                transform: 'translateX(-50%)',
                zIndex: 1,
              }}
              width="20"
              height="20"
              viewBox="0 0 30 30"
              fill="#ffffff"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 0L29.1962 29.1962H0.803848L15 0Z"
                fill="#ffffff" 
              />
            </svg>
          <div
            style={{
              backgroundColor: '#fff',
              boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
              border: '1px solid #f5f5f5', 
              padding: '10px',
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
    );
  }
}

export default CustomPopover;