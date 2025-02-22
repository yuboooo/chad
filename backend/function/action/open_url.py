import webbrowser

def execute_open_url(action):
    """
    Execute the open_url action based on the provided action dictionary.
    
    Args:
        action (dict): Action dictionary with format:
            {'type': 'open_url', 'params': {'url': 'https://example.com'}}
    
    Returns:
        int: 1 if successful, 0 if failed or invalid action
    """
    # Check if action is empty
    if not action:
        return 0
    
    try:
        # Validate action format
        if action.get('type') != 'open_url' or 'params' not in action:
            return 0
        
        # Get URL from params
        url = action['params'].get('url')
        if not url:
            return 0
            
        # Open URL in default browser
        webbrowser.open(url)
        return 1
        
    except Exception as e:
        print(f"Error opening URL: {str(e)}")
        return 0
