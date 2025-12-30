import subprocess
import os
import platform
import sys
import time

def run_npm_install(directory):
    """Run npm install in the specified directory"""
    try:
        print(f"Installing dependencies in {directory}...")
        os.chdir(directory)
        
        if platform.system() == "Windows":
            subprocess.run(["npm", "install"], shell=True, check=True)
        else:
            subprocess.run(["npm", "install"], check=True)
            
        print(f"Dependencies installed successfully in {directory}")
        
    except subprocess.CalledProcessError as e:
        print(f"Error installing dependencies in {directory}: {e}")
        return False
    except FileNotFoundError:
        print(f"Error: {directory} directory not found")
        return False
    finally:
        # Change back to root directory
        os.chdir("..")
    
    return True

def start_client_in_vscode_terminal():
    """Start client development server in a new VS Code terminal"""
    try:
        # Use VS Code CLI to create a new terminal and run commands
        subprocess.Popen([
            "code", "--command", "workbench.action.terminal.new"
        ])
        
        # Small delay to ensure terminal is created
        time.sleep(2)
        
        # Send commands to the terminal
        subprocess.Popen([
            "code", "--command", "workbench.action.terminal.sendSequence",
            "--args", '{"text":"cd client && npm run dev\\n"}'
        ])
        
        print("Client development server started in VS Code terminal")
        return True
        
    except Exception as e:
        print(f"Error starting client in VS Code terminal: {e}")
        return False

def start_server_in_vscode_terminal():
    """Start server development server in a new VS Code terminal"""
    try:
        # Use VS Code CLI to create a new terminal and run commands
        subprocess.Popen([
            "code", "--command", "workbench.action.terminal.new"
        ])
        
        # Small delay to ensure terminal is created
        time.sleep(2)
        
        # Send commands to the terminal
        subprocess.Popen([
            "code", "--command", "workbench.action.terminal.sendSequence",
            "--args", '{"text":"cd server && npm run dev\\n"}'
        ])
        
        print("Server development server started in VS Code terminal")
        return True
        
    except Exception as e:
        print(f"Error starting server in VS Code terminal: {e}")
        return False

def create_vscode_terminals():
    """Alternative method using PowerShell to send keys to VS Code"""
    try:
        current_dir = os.getcwd()
        
        if platform.system() == "Windows":
            # Create client terminal
            powershell_script_client = f"""
            $wshell = New-Object -ComObject wscript.shell
            $wshell.SendKeys('^+`')
            Start-Sleep -Seconds 1
            $wshell.SendKeys('cd "{current_dir}\\client"{{ENTER}}')
            Start-Sleep -Seconds 1
            $wshell.SendKeys('npm run dev{{ENTER}}')
            """
            
            subprocess.Popen([
                "powershell", "-Command", powershell_script_client
            ])
            
            time.sleep(3)
            
            # Create server terminal
            powershell_script_server = f"""
            $wshell = New-Object -ComObject wscript.shell
            $wshell.SendKeys('^+`')
            Start-Sleep -Seconds 1
            $wshell.SendKeys('cd "{current_dir}\\server"{{ENTER}}')
            Start-Sleep -Seconds 1
            $wshell.SendKeys('npm run dev{{ENTER}}')
            """
            
            subprocess.Popen([
                "powershell", "-Command", powershell_script_server
            ])
            
            return True
        else:
            # For Linux/Mac, use xdotool if available
            try:
                # Create client terminal
                subprocess.run(["xdotool", "key", "ctrl+shift+grave"], check=True)
                time.sleep(1)
                subprocess.run(["xdotool", "type", f"cd {current_dir}/client"], check=True)
                subprocess.run(["xdotool", "key", "Return"], check=True)
                time.sleep(1)
                subprocess.run(["xdotool", "type", "npm run dev"], check=True)
                subprocess.run(["xdotool", "key", "Return"], check=True)
                
                time.sleep(2)
                
                # Create server terminal
                subprocess.run(["xdotool", "key", "ctrl+shift+grave"], check=True)
                time.sleep(1)
                subprocess.run(["xdotool", "type", f"cd {current_dir}/server"], check=True)
                subprocess.run(["xdotool", "key", "Return"], check=True)
                time.sleep(1)
                subprocess.run(["xdotool", "type", "npm run dev"], check=True)
                subprocess.run(["xdotool", "key", "Return"], check=True)
                
                return True
            except (subprocess.CalledProcessError, FileNotFoundError):
                print("xdotool not found. Please install it: sudo apt-get install xdotool")
                return False
    except Exception as e:
        print(f"Error creating VS Code terminals: {e}")
        return False

def main():
    """Main function to install dependencies and run both client and server in VS Code terminals"""
    print("Installing dependencies...")
    
    # Install dependencies for both client and server
    client_install_success = run_npm_install("client")
    server_install_success = run_npm_install("server")
    
    # Only proceed if both installations were successful
    if not (client_install_success and server_install_success):
        print("Failed to install dependencies. Exiting...")
        sys.exit(1)
    
    print("Starting development servers in VS Code terminals...")
    print("Make sure VS Code is focused and active...")
    
    # Small delay to allow user to focus VS Code
    time.sleep(2)
    
    # Try VS Code CLI method first, fallback to keyboard automation
    try:
        # Attempt to use VS Code CLI
        client_started = start_client_in_vscode_terminal()
        time.sleep(2)
        server_started = start_server_in_vscode_terminal()
        
        if not (client_started and server_started):
            print("VS Code CLI method failed, trying keyboard automation...")
            success = create_vscode_terminals()
            if success:
                print("Development servers started using keyboard automation!")
            else:
                print("Failed to start development servers.")
        else:
            print("Both development servers started successfully in VS Code terminals!")
            
    except Exception:
        print("Trying keyboard automation method...")
        success = create_vscode_terminals()
        if success:
            print("Development servers started using keyboard automation!")
        else:
            print("Failed to start development servers.")
    
    print("Script completed. Check your VS Code terminals for the running servers.")

if __name__ == "__main__":
    main()