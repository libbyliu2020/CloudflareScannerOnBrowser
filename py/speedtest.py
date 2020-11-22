#!/usr/bin/env python3
import requests
from multiprocessing import Pool
from datetime import datetime
g_cnt = 0
def requests_test(ip):
    global g_cnt
    g_cnt = g_cnt + 1
    g_cnt_str = '[' + str(g_cnt) + ']'
    try:
        dl_speed = list()
        for i in range(5):
            headers={'Host':'speed.cloudflare.com'}
            ip='speed.cloudflare.com';
            response = requests.get("http://%s/__down?bytes=1000000"%ip,stream=True,headers=headers,timeout=1)
            dl=0
            dt=datetime.now()
            # 每块16KB,越大分块可能越快.
            for data in response.iter_content(chunk_size=16384):
                dl += len(data)
                # 大于10秒直接出结果,10秒内下载完你大概是火箭.
                if (datetime.now() - dt).seconds > 10:
                    dl_speed.append(round((dl / 10) / 1024 / 1024, 2))
                    break
        print(g_cnt_str + ip + '速度:' + str(dl_speed[0]) + ' MB/s | ' + str(dl_speed[1]) + ' MB/s | ' + str(
            dl_speed[2]) + ' MB/s | ' + str(dl_speed[3]) + ' MB/s | ' + str(dl_speed[4]) + ' MB/s')
    except requests.exceptions.ConnectionError:
        print(g_cnt_str + '无法使用(失效):' + ip)
    except requests.exceptions.ReadTimeout:
        print(g_cnt_str + '无法使用(低速):' + ip)
    except requests.exceptions.ChunkedEncodingError:
        print(g_cnt_str + '无法使用(错误):' + ip)
    except KeyboardInterrupt:
        exit(0)
    except:
        print(g_cnt_str + '无法使用(未知):' + ip)


with open('ips.csv') as f:
    ips = f.read().split('\n')
    # 要注意总带宽容量,每线程至少需要1Mbps才能消化.
    p=Pool()
    for ip in ips:
        p.apply_async(requests_test,args=(ip,))
    p.close()
    p.join()