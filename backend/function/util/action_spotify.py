import asyncio
import subprocess
import webbrowser
import platform

class SpotifyHandler:
    def __init__(self):
        self.os_type = platform.system().lower()

    async def open_spotify(self, song=None):
        """Handle Spotify-related actions"""
        try:
            # Open Spotify application based on OS
            if self.os_type == "darwin":  # macOS
                subprocess.Popen(["open", "-a", "Spotify"])
            elif self.os_type == "windows":
                subprocess.Popen(["start", "spotify"], shell=True)
            elif self.os_type == "linux":
                subprocess.Popen(["spotify"])
            
            if song:
                # Wait for Spotify to launch
                await asyncio.sleep(2)
                # Create Spotify search URL and open it
                spotify_url = f"spotify:search:{song}"
                webbrowser.open(spotify_url)
                return True
        except Exception as e:
            print(f"Error opening Spotify: {str(e)}")
            return False 