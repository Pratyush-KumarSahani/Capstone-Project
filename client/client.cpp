#include <iostream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <dirent.h>
#include <fstream>
#include <string>
#include <cstring>

using namespace std;

#define PORT 8080
#define SERVER_IP "127.0.0.1"
#define BUFFER_SIZE 1024

//  List files in client_files folder
void listClientFiles() {
    DIR *dir = opendir("client_files");
    cout << "\n Files in client_files folder:\n";
    if (!dir) {
        cout << "Error: Folder not found.\n";
        return;
    }

    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        string name = entry->d_name;
        if (name != "." && name != "..")
            cout << " - " << name << endl;
    }
    closedir(dir);
}

//  Authentication before continuing
bool authenticate(int sock) {
    string username, password;
    cout << "\n=== LOGIN REQUIRED ===\n";
    cout << "Username: ";
    cin >> username;
    cout << "Password: ";
    cin >> password;

    send(sock, username.c_str(), username.size(), 0);
    send(sock, password.c_str(), password.size(), 0);

    char buffer[BUFFER_SIZE];
    int bytes = recv(sock, buffer, sizeof(buffer) - 1, 0);
    if (bytes <= 0) return false;
    buffer[bytes] = '\0';
    string response(buffer);

    if (response == "AUTH_SUCCESS") {
        cout << "✅ Login successful!\n";
        return true;
    } else {
        cout << "❌ Invalid username or password.\n";
        return false;
    }
}

int main() {
    // Create socket
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        cerr << "❌ Socket creation failed.\n";
        return 1;
    }

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(PORT);
    serverAddr.sin_addr.s_addr = inet_addr(SERVER_IP);

    cout << "Connecting to server...\n";
    if (connect(sock, (sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) {
        cerr << "❌ Connection failed.\n";
        close(sock);
        return 1;
    }

    if (!authenticate(sock)) {
        close(sock);
        return 0;
    }

    cout << "\nWelcome to Secure File Sharing System 🔒\n";

    while (true) {
        cout << "\n=== MENU ===\n";
        cout << "1. Show Server files\n";
        cout << "2. Show Client files\n";
        cout << "3. Upload file\n";
        cout << "4. Download file\n";
        cout << "5. Exit\n";
        cout << "Enter choice: ";
        int choice;
        cin >> choice;

        if (choice == 1) {
            string cmd = "LIST_SERVER";
            send(sock, cmd.c_str(), cmd.size(), 0);

            char buffer[4096];
            int bytes = recv(sock, buffer, sizeof(buffer) - 1, 0);
            if (bytes > 0) {
                buffer[bytes] = '\0';
                cout << "\nServer files:\n" << buffer << endl;
            } else {
                cout << "❌ Failed to retrieve file list.\n";
            }

        } else if (choice == 2) {
            listClientFiles();

        } else if (choice == 3) {
            string filename;
            cout << "Enter file to upload (from client_files): ";
            cin >> filename;
            string command = "UPLOAD:" + filename;
            send(sock, command.c_str(), command.size(), 0);

            string filePath = "client_files/" + filename;
            ifstream file(filePath, ios::binary);
            if (!file.is_open()) {
                cout << "❌ File not found.\n";
                continue;
            }

            file.seekg(0, ios::end);
            size_t fileSize = file.tellg();
            file.seekg(0, ios::beg);
            send(sock, reinterpret_cast<char*>(&fileSize), sizeof(fileSize), 0);

            char buffer[BUFFER_SIZE];
            while (!file.eof()) {
                file.read(buffer, sizeof(buffer));
                int bytesRead = file.gcount();
                send(sock, buffer, bytesRead, 0);
            }
            file.close();
            cout << "✅ File uploaded successfully!\n";

        } else if (choice == 4) {
            string filename;
            cout << "Enter file name to download: ";
            cin >> filename;
            string command = "DOWNLOAD:" + filename;
            send(sock, command.c_str(), command.size(), 0);

            size_t fileSize;
            if (recv(sock, reinterpret_cast<char*>(&fileSize), sizeof(fileSize), 0) <= 0) {
                cout << "❌ Failed to get file size.\n";
                continue;
            }

            ofstream file("client_files/" + filename, ios::binary);
            if (!file.is_open()) {
                cout << "❌ Cannot create file.\n";
                continue;
            }

            char buffer[BUFFER_SIZE];
            size_t totalReceived = 0;
            while (totalReceived < fileSize) {
                int bytesReceived = recv(sock, buffer, sizeof(buffer), 0);
                if (bytesReceived <= 0) break;
                file.write(buffer, bytesReceived);
                totalReceived += bytesReceived;
            }
            file.close();
            cout << "✅ Download complete!\n";

        } else if (choice == 5) {
            string cmd = "EXIT";
            send(sock, cmd.c_str(), cmd.size(), 0);
            break;

        } else {           cout << "Invalid choice.\n";
        }
    }

    close(sock);
    return 0;
}
